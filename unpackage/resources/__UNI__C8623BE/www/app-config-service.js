
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/home","pages/map/map","pages/mine/mine","pages/list1/list1","pages/detail/detail","pages/list2/list2","pages/lanmu/lanmu","pages/list4/list4","pages/html/html","pages/list3/list3","pages/list5/list5","pages/pinglunForm/pinglunForm","pages/pinglun/pinglun","pages/myPinglun/myPinglun","pages/fankuiForm/fankuiForm","pages/fankuiList/fankuiList","pages/lineOur/lineOur","pages/search/search","pages/weatherDetail/weatherDetail"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"走进诗画梅江","navigationBarBackgroundColor":"#297CFE","backgroundColor":"#297CFE"},"tabBar":{"color":"#787F83","selectedColor":"#297CFE","backgroundColor":"#FFFFFF","borderStyle":"black","fontSize":"16px","spacing":"10px","list":[{"pagePath":"pages/home/home","text":"首页","iconPath":"static/img/home.png","selectedIconPath":"static/img/home-act.png"},{"pagePath":"pages/map/map","text":"地图","iconPath":"static/img/map.png","selectedIconPath":"static/img/map-act.png"},{"pagePath":"pages/mine/mine","text":"我的","iconPath":"static/img/my.png","selectedIconPath":"static/img/my-act.png"}]},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"MeiJiangTravel","compilerVersion":"2.8.8","entryPagePath":"pages/home/home","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/home","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/map/map","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/mine/mine","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/list1/list1","meta":{},"window":{}},{"path":"/pages/detail/detail","meta":{},"window":{}},{"path":"/pages/list2/list2","meta":{},"window":{}},{"path":"/pages/lanmu/lanmu","meta":{},"window":{}},{"path":"/pages/list4/list4","meta":{},"window":{}},{"path":"/pages/html/html","meta":{},"window":{}},{"path":"/pages/list3/list3","meta":{},"window":{}},{"path":"/pages/list5/list5","meta":{},"window":{}},{"path":"/pages/pinglunForm/pinglunForm","meta":{},"window":{}},{"path":"/pages/pinglun/pinglun","meta":{},"window":{}},{"path":"/pages/myPinglun/myPinglun","meta":{},"window":{}},{"path":"/pages/fankuiForm/fankuiForm","meta":{},"window":{}},{"path":"/pages/fankuiList/fankuiList","meta":{},"window":{}},{"path":"/pages/lineOur/lineOur","meta":{},"window":{}},{"path":"/pages/search/search","meta":{},"window":{}},{"path":"/pages/weatherDetail/weatherDetail","meta":{},"window":{}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
