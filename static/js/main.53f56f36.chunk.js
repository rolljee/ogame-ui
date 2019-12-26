(this["webpackJsonpogame-ui"]=this["webpackJsonpogame-ui"]||[]).push([[0],{12:function(e,t,a){e.exports=a(19)},17:function(e,t,a){},19:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(9),s=a.n(c),l=(a(17),a(10)),i=a(1),u=a(2),o=a(4),d=a(3),h=a(6),m=a(5),p=a(7),b={light:"light",dark:"dark"},y=[{rate:"2.5:1.6:1"},{rate:"2:1.5:1"},{rate:"1.8:1.4:1"}],v={crystal:"crystal",deut:"deut",metal:"metal"},g=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).renderRates=a.renderRates.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(u.a)(t,[{key:"renderRates",value:function(e,t){var a=this,n=e.rate,c=this.props.getActiveRate(n);return r.a.createElement("span",{className:"margin-right-sm",key:t},r.a.createElement("button",{onClick:function(){return a.props.setRate(n)},className:"btn label label-".concat(c," clickable")},n))}},{key:"render",value:function(){var e=this;return y.map((function(t,a){return e.renderRates(t,a)}))}}]),t}(r.a.Component),f=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props.children;return r.a.createElement("div",{className:"container-fluid full-height"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"col-xs-12"},e)))}}]),t}(r.a.Component),O=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"input-group"},r.a.createElement("span",{className:"input-group-addon text-white"},this.props.text),r.a.createElement("input",{className:"form-control input-xs",disabled:this.props.disabled?"disabled":"",max:this.props.maxValue,min:"0",onChange:this.props.onChange,placeholder:this.props.placeholder,type:"number",value:this.props.value}))}}]),t}(r.a.Component),j=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).resources=[{name:"%metal",maxValue:100,resource:v.metal,percent:"percentMetal"},{name:"%crystal",maxValue:100,resource:v.crystal,percent:"percentCrystal"},{name:"%deut",maxValue:100,resource:v.deut,percent:"percentDeut"}],a}return Object(m.a)(t,e),Object(u.a)(t,[{key:"renderRadio",value:function(e,t){var a=this,n=e.resource,c=e.name,s=e.maxValue,l=e.percent;return r.a.createElement("div",{className:"col-md-4 col-sm-4 col-xs-12",key:t},r.a.createElement(O,{text:c,disabled:this.props.isCurrentRessource(n),maxValue:s,onChange:function(e){return a.props.handlePercentChange(e,n)},placeholder:n,value:this.props[l]}))}},{key:"render",value:function(){var e=this;return this.resources.map((function(t,a){return e.renderRadio(t,a)}))}}]),t}(r.a.Component),C=a(11),k=a.n(C),R=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).handleOnClick=a.handleOnClick.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(u.a)(t,[{key:"handleOnClick",value:function(){k()(this.props.text)}},{key:"render",value:function(){return r.a.createElement("button",{onClick:this.handleOnClick,className:"btn btn-inverse"},"Copy")}}]),t}(r.a.Component),E=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"prettify",value:function(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}},{key:"getText",value:function(e,t,a,n){return n===v.deut?"Trade:\n".concat(a," deut\n\nAgainst:\n").concat(e," metal\n").concat(t," crystal"):n===v.crystal?"Trade:\n".concat(t," crystal\n\nAgainst:\n").concat(e," metal\n").concat(a," deut"):n===v.metal?"Trade:\n".concat(e," metal\n\nAgainst:\n").concat(a," deut\n").concat(t," crystal"):"Nothing to sell yet"}},{key:"render",value:function(){var e=this.props,t=e.metal,a=e.crystal,n=e.deut,c=e.selected,s=this.prettify(n),l=this.prettify(t),i=this.prettify(a),u=this.getText(l,i,s,c);return r.a.createElement(r.a.Fragment,null,"deut: ",s," metal: ",l," crystal: ",i,r.a.createElement("div",{className:"margin-top"},r.a.createElement(R,{text:u})))}}]),t}(r.a.Component),N=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).resources=[{id:v.metal},{id:v.crystal},{id:v.deut}],a}return Object(m.a)(t,e),Object(u.a)(t,[{key:"renderInput",value:function(e,t){var a=this,n=v[e.id];return r.a.createElement("div",{className:"col-md-4 col-sm-4 col-xs-12",key:t},r.a.createElement(O,{text:n,onChange:function(e){return a.props.handleRateChange(e,n)},placeholder:n,value:this.props.getRate(n)}))}},{key:"render",value:function(){var e=this;return this.resources.map((function(t,a){return e.renderInput(t,a)}))}}]),t}(r.a.Component),x=function(e){function t(){return Object(i.a)(this,t),Object(o.a)(this,Object(d.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.rate,a=e.selected,n=p.a.parseRate(t,a),r=n.rateMetal,c=n.rateCrystal,s=n.rateDeut;return"deut"===a?"".concat(s," deut = ").concat(r," metal and ").concat(c," crystal"):"metal"===a?"".concat(r," metal = ").concat(s," deut and ").concat(c," crystal"):"crystal"===a?"".concat(c," crystal = ").concat(s," deut and ").concat(r," metal"):"Nothing selected"}}]),t}(r.a.Component),D=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).resources=[{displayName:"Metal",name:v.metal},{displayName:"Crystal",name:v.crystal},{displayName:"Deut",name:v.deut}],a.renderResources=a.renderResources.bind(Object(h.a)(a)),a}return Object(m.a)(t,e),Object(u.a)(t,[{key:"renderResources",value:function(e,t){var a=this;return r.a.createElement("div",{className:"col-md-4 col-sm-4 col-xs-12",key:t},r.a.createElement(O,{disabled:this.props.isNotCurrentResource(e.name),onChange:function(t){return a.props.handleResourceChange(t,e.name)},placeholder:e.name,text:e.displayName,value:this.props[e.name]}))}},{key:"render",value:function(){var e=this;return this.resources.map((function(t,a){return e.renderResources(t,a)}))}}]),t}(r.a.Component),w=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(o.a)(this,Object(d.a)(t).call(this,e))).resources=[{id:v.metal},{id:v.crystal},{id:v.deut}],a}return Object(m.a)(t,e),Object(u.a)(t,[{key:"renderLabel",value:function(e,t){var a=this,n=v[e.id],c=this.props.getActiveTrade(n);return r.a.createElement("span",{className:"margin-right-sm",key:t},r.a.createElement("button",{onClick:function(){return a.props.handleOnChange(n)},className:"btn btn-lg label label-".concat(c," clickable")},n))}},{key:"render",value:function(){var e=this;return this.resources.map((function(t,a){return e.renderLabel(t,a)}))}}]),t}(r.a.Component);function M(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function P(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?M(a,!0).forEach((function(t){Object(l.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):M(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var S=function(e){function t(){var e;return Object(i.a)(this,t),(e=Object(o.a)(this,Object(d.a)(t).call(this))).state={background:b.dark,crystal:0,deut:0,metal:0,percentCrystal:40,percentDeut:0,percentMetal:60,rate:"2:1.5:1",selected:v.deut},e.getActiveRate=e.getActiveRate.bind(Object(h.a)(e)),e.getRate=e.getRate.bind(Object(h.a)(e)),e.handleOnChange=e.handleOnChange.bind(Object(h.a)(e)),e.getActiveTrade=e.getActiveTrade.bind(Object(h.a)(e)),e.handlePercentChange=e.handlePercentChange.bind(Object(h.a)(e)),e.handleRateChange=e.handleRateChange.bind(Object(h.a)(e)),e.handleResourceChange=e.handleResourceChange.bind(Object(h.a)(e)),e.handleResourceChange=e.handleResourceChange.bind(Object(h.a)(e)),e.isCurrentRessource=e.isCurrentRessource.bind(Object(h.a)(e)),e.isNotCurrentResource=e.isNotCurrentResource.bind(Object(h.a)(e)),e.setBackground=e.setBackground.bind(Object(h.a)(e)),e.setRate=e.setRate.bind(Object(h.a)(e)),e}return Object(m.a)(t,e),Object(u.a)(t,[{key:"sellDeut",value:function(){var e=this.state,t=e.deut,a=e.percentMetal,n=e.percentCrystal,r=e.rate,c=p.a.sellDeut(t,a,n,r),s=c.metal,l=c.crystal;this.setState({metal:s,crystal:l})}},{key:"sellMetal",value:function(){var e=this.state,t=e.metal,a=e.percentDeut,n=e.percentCrystal,r=e.rate,c=p.a.sellMetal(t,a,n,r),s=c.crystal,l=c.deut;this.setState({deut:l,crystal:s})}},{key:"sellCrystal",value:function(){var e=this.state,t=e.crystal,a=e.percentDeut,n=e.percentMetal,r=e.rate,c=p.a.sellCrystal(t,a,n,r),s=c.metal,l=c.deut;this.setState({metal:s,deut:l})}},{key:"printResult",value:function(){this.state.selected===v.deut?this.sellDeut():this.state.selected===v.metal?this.sellMetal():this.state.selected===v.crystal&&this.sellCrystal()}},{key:"handleOnChange",value:function(e){this.setState({selected:e})}},{key:"handleResourceChange",value:function(e,t){var a=Number(e.target.value);t===v.deut?this.setState({deut:a},this.printResult):t===v.metal?this.setState({metal:a},this.printResult):t===v.crystal&&this.setState({crystal:a},this.printResult)}},{key:"handleRateChange",value:function(e,t){var a=e.target.value,n=this.state.rate.split(":"),r=n[2],c=n[0],s=n[1],l="".concat(c,":").concat(s,":").concat(r);t===v.deut?l="".concat(c,":").concat(s,":").concat(a):t===v.metal?l="".concat(a,":").concat(s,":").concat(r):t===v.crystal&&(l="".concat(c,":").concat(a,":").concat(r)),this.setState({rate:l},this.printResult)}},{key:"roundToHundred",value:function(e,t){var a=this.state.selected;return a===v.deut&&t===v.metal?{percentCrystal:100-e}:a===v.deut&&t===v.crystal?{percentMetal:100-e}:a===v.metal&&t===v.deut?{percentCrystal:100-e}:a===v.metal&&t===v.crystal?{percentDeut:100-e}:a===v.crystal&&t===v.metal?{percentDeut:100-e}:a===v.crystal&&t===v.deut?{percentMetal:100-e}:void 0}},{key:"handlePercentChange",value:function(e,t){var a=this.roundValue(Number(e.target.value));t===v.deut?this.setState(P({percentDeut:a},this.roundToHundred(a,v.deut)),this.printResult):t===v.metal?this.setState(P({percentMetal:a},this.roundToHundred(a,v.metal)),this.printResult):t===v.crystal&&this.setState(P({percentCrystal:a},this.roundToHundred(a,v.crystal)),this.printResult)}},{key:"getRate",value:function(e){var t=this.state.rate.split(":"),a=t[2],n=t[0],r=t[1];return e===v.deut?a:e===v.metal?n:e===v.crystal?r:void 0}},{key:"getActiveRate",value:function(e){return e===this.state.rate?"info":"default"}},{key:"getActiveTrade",value:function(e){return e===this.state.selected?"info":"default"}},{key:"setRate",value:function(e){this.setState({rate:e})}},{key:"getPercent",value:function(e){var t=this.state,a=t.percentCrystal,n=t.percentDeut,r=t.percentMetal,c=this.roundValue(n),s=this.roundValue(r),l=this.roundValue(a);return e===v.deut?{percentCrystal:l,percentDeut:0,percentMetal:s}:e===v.metal?{percentCrystal:l,percentDeut:c,percentMetal:0}:e===v.crystal?{percentCrystal:0,percentDeut:c,percentMetal:s}:void 0}},{key:"isCurrentRessource",value:function(e){return e===this.state.selected}},{key:"isNotCurrentResource",value:function(e){return this.state.selected!==e}},{key:"roundValue",value:function(e){return e>100?100:e}},{key:"setBackground",value:function(){this.setState({background:this.state.background===b.light?b.dark:b.light})}},{key:"render",value:function(){var e=this.state,t=e.metal,a=e.crystal,n=e.deut,c=e.selected,s=e.rate,l=e.background,i=this.getPercent(c),u=i.percentMetal,o=i.percentCrystal,d=i.percentDeut;return r.a.createElement(f,{background:l,setBackground:this.setBackground},r.a.createElement("div",{className:"col-sm-12"},r.a.createElement("div",{className:"text-center"},r.a.createElement("h6",{className:"margin-top text-white"},"Select ressource"),r.a.createElement("div",{className:"margin-bottom"},r.a.createElement(w,{handleOnChange:this.handleOnChange,getActiveTrade:this.getActiveTrade})))),r.a.createElement("div",{className:"col-sm-12"},r.a.createElement("hr",null),r.a.createElement("h6",{className:"margin-top text-white"},"Rates"),r.a.createElement("div",{className:"text-center margin-bottom"},r.a.createElement(g,{getActiveRate:this.getActiveRate,setRate:this.setRate})),r.a.createElement(N,{getRate:this.getRate,handleRateChange:this.handleRateChange})),r.a.createElement("div",{className:"col-sm-12"},r.a.createElement("hr",null),r.a.createElement("h6",{className:"margin-top text-white"},"Percents"),r.a.createElement(j,{handlePercentChange:this.handlePercentChange,isCurrentRessource:this.isCurrentRessource,percentCrystal:o,percentDeut:d,percentMetal:u})),r.a.createElement("div",{className:"col-sm-12"},r.a.createElement("hr",null),r.a.createElement("h6",{className:"margin-top text-white"},"Resources"),r.a.createElement("p",{className:"text-center text-white"},r.a.createElement(x,{rate:s,selected:c})),r.a.createElement(D,{crystal:a,deut:n,handleResourceChange:this.handleResourceChange,isNotCurrentResource:this.isNotCurrentResource,metal:t})),r.a.createElement("div",{className:"col-sm-12 margin-top text-white text-center"},r.a.createElement(E,{deut:n,metal:t,crystal:a,selected:c})))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(S,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[12,1,2]]]);
//# sourceMappingURL=main.53f56f36.chunk.js.map