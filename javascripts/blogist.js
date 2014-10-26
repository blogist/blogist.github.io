var username = $("meta[name=username]").attr("content");

var blogdetailModel = Model.extend({
	dataOptions:{dataType:"jsonp"}
});

var GIST_DIGEST_URL = 'post@https://gist.github.com.ru/jcouyang/46bb290f1b99eef15639';

var bloglistModelFor = function(name){
	return Model.extend({
		dataOptions:{
			crossDomain: true, data:{base_url:"https://gist.github.com/" + name}}
	});
};

var BloglistModel = bloglistModelFor(username);

var bloglistModel = new BloglistModel("bloglist",GIST_DIGEST_URL);

var BlogDetailView = View.extend({
	el:$("#blogist"),
	template:"src/templates/article.html"
});

var BloglistView = View.extend({
	model:bloglistModel,
	el: $("#blogist"),
	template:"src/templates/gistlist.html",
	preProcessData:function(data){
		return {results: JSON.parse(data.results)};
	}
});

var router = new Router();
var bloglist;
router.get("/", function(){
	loading()
	bloglist = new BloglistView();
	bloglist.render({page:1});
	$('#disqus_thread').remove();
});

router.get("/page/:number", function(params){
	loading();
	bloglist.render({page:params.number});
});

var loadDisqus = function(){
	if(!$('#disqus_thread').length)
		$("#blogist").append($("<div id='disqus_thread'></div>"));
	disqus_identifier = window.location.hash.replace('#','');
	disqus_url = window.location.href.replace('/#','');
	disqus_title = $('h2.page-header').text()|| $('.gist-meta a').eq(1).text() || document.title;
	DISQUS.reset({reload:true});
};

var blogDetailOf = function(gistid){
	var model = new blogdetailModel(gistid,'get@https://gist.github.com/'+username+'/'+ gistid +".json");
	var view = new BlogDetailView({model:model});
	view.render({disqus_name:$('meta[name=disqus_name]').attr('content')}).then(loadDisqus);
};

router.get("/gist/:gistid/?",function(params,data){
	loading();
	blogDetailOf(params.gistid);
});

router.get("/gist/:gistid/.+",function(params,data){
	loading();
	blogDetailOf(params.gistid);
});

$('#overlord').hover(function(){
	$(this).addClass('overlord_active');
},function(){
	$(this).removeClass('overlord_active');
});

var loading = function(){
	$('#blogist').html('<img src="stylesheets/img/loading-cubes.svg" class="center-block">');
};

// for trail user
patharray = location.pathname.split('/');
if(patharray.length === 2){
  
	loading();
  
	var BloglistModel = bloglistModelFor(patharray[1]);

	var bloglistModel = new BloglistModel("bloglist",GIST_DIGEST_URL);

	var TrailBloglistView = BloglistView.extend({
		model:bloglistModel
	});

	bloglist = new TrailBloglistView();
	bloglist.render({page:1});

};
