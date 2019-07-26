function Observer() {
    var observer = {};
    var viewList = [];

    observer.addView = function(view) {
        viewList.push(view);
    };
	
	observer.country = function(){
		return "china";
	};
	
    observer.fireEvent = function(message, data, from) {
        viewList.forEach(function(view) {
            if (view.hasOwnProperty('onMessage')) {
                view.onMessage(message, data, from);
            }

        })
    };
    return observer;
	
}

var obs = Observer();
var view1 = View1(obs);
var view2 = View2(obs);
//var view3 = View3(obs);
//var view4 = View4(obs);
