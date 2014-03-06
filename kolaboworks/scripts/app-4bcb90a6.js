!function(){"use strict";var e="undefined"!=typeof window?window:global;if("function"!=typeof e.require){var t={},r={},s=function(e,t){return{}.hasOwnProperty.call(e,t)},n=function(e,t){var r,s,n=[];r=/^\.\.?(\/|$)/.test(t)?[e,t].join("/").split("/"):t.split("/");for(var o=0,a=r.length;a>o;o++)s=r[o],".."===s?n.pop():"."!==s&&""!==s&&n.push(s);return n.join("/")},o=function(e){return e.split("/").slice(0,-1).join("/")},a=function(t){return function(r){var s=o(t),a=n(s,r);return e.require(a,t)}},i=function(e,t){var s={id:e,exports:{}};return r[e]=s,t(s.exports,a(e),s),s.exports},u=function(e,o){var a=n(e,".");if(null==o&&(o="/"),s(r,a))return r[a].exports;if(s(t,a))return i(a,t[a]);var u=n(a,"./index");if(s(r,u))return r[u].exports;if(s(t,u))return i(u,t[u]);throw new Error('Cannot find module "'+e+'" from "'+o+'"')},l=function(e,r){if("object"==typeof e)for(var n in e)s(e,n)&&(t[n]=e[n]);else t[e]=r},p=function(){var e=[];for(var r in t)s(t,r)&&e.push(r);return e};e.require=u,e.require.define=l,e.require.register=l,e.require.list=p,e.require.brunch=!0}}(),require.register("adapters/application",function(e,t,r){r.exports=App.ApplicationAdapter=DS.FixtureAdapter.extend({latency:600})}),require.register("config/app",function(e,t,r){var s,n;s=t("config/environment"),s.get("isDevelopment")?(n={LOG_TRANSITIONS:!0,LOG_TRANSITIONS_INTERNAL:!1,LOG_STACKTRACE_ON_DEPRECATION:!0,LOG_BINDINGS:!0,LOG_VIEW_LOOKUPS:!0,LOG_ACTIVE_GENERATION:!0},Ember.RSVP.configure("onerror",function(e){var t;return"object"===Ember.typeOf(e)?(t=(null!=e?e.message:void 0)||"No error message",Ember.Logger.error("RSVP Error: "+t),Ember.Logger.error(null!=e?e.stack:void 0),Ember.Logger.error(null!=e?e.object:void 0)):Ember.Logger.error("RSVP Error",e)}),Ember.STRUCTURED_PROFILE=!0,Ember.Logger.debug("Running in the %c"+s.get("name")+"%c environment","color: red;","")):n={},Ember.isBlank=function(e){return Ember.isEmpty(e)||"string"==typeof e&&null===e.match(/\S/)},Ember.LinkView.reopen({active:Ember.computed(function(){var e,t,r,s,n,o,a,i,u;if(Ember.get(this,"loading"))return!1;for(a=Ember.get(this,"router"),o=Ember.get(this,"routeArgs"),e=o.slice(1),s=Ember.get(this,"resolvedParams"),t=this.currentWhen||o[0],this.currentWhen&&(e=[]),r=t.split("|"),i=0,u=r.length;u>i;i++)if(n=r[i],a.isActive.apply(a,[n].concat(e)))return Ember.get(this,"activeClass")}).property("resolvedParams","routeArgs")}),r.exports=Ember.Application.create(n)}),require.register("config/environment",function(e,t,r){var s;window.require.list().filter(function(e){return new RegExp("^config/environments/").test(e)?t(e):void 0}),s=Ember.Object.extend({isTest:Ember.computed.equal("name","test"),isDevelopment:Ember.computed.equal("name","development"),isProduction:Ember.computed.equal("name","production")}),r.exports=s.create(window.TAPAS_ENV)}),require.register("config/router",function(e,t,r){r.exports=App.Router.map(function(){return this.resource("workgroup",{path:"/workgroups/:workgroup_id"},function(){return this.resource("tasks",function(){return this.route("todo",{path:"/"}),this.route("done")}),this.resource("task",{path:"/tasks/:task_id"},function(){return this.route("attachments"),this.route("subscribers")}),this.resource("project",{path:"/projects/:project_id"},function(){return this.route("progress"),this.route("attachments")})})})}),require.register("controllers/route-trail",function(e,t,r){r.exports=App.RouteTrailController=Ember.ObjectController.extend()}),require.register("controllers/task",function(e,t,r){r.exports=App.TaskController=Ember.ObjectController.extend(App.AutosavableController,{bufferedFields:["name","body"],instaSaveFields:["completed"]})}),require.register("controllers/tasks",function(e,t,r){r.exports=App.TasksController=Ember.ArrayController.extend({needs:["workgroup","route-trail"],clearForm:function(){return this.set("newTaskName","")},newTaskNameObserver:function(){var e,t;return t=this.get("newTaskName"),e=this.get("newTask"),Ember.isEmpty(t)&&e?(Ember.Logger.debug("temporary new task deleted"),this.store.deleteRecord(e),this.set("newTask",void 0),this.transitionToRoute(this.get("controllers.route-trail.route"))):Ember.isEmpty(t)?void 0:e?e.set("name",t):(e=this.store.createRecord("task",{workgroup:this.get("controllers.workgroup.model"),name:t}),this.set("newTask",e),this.transitionToRoute("task",e))}.observes("newTaskName")})}),require.register("initialize",function(e,t){var r;window.App=t("config/app"),t("config/router"),r=["initializers","utils","mixins","adapters","serializers","routes","models","views","controllers","helpers","templates","components"],r.forEach(function(e){return window.require.list().filter(function(t){return new RegExp("^"+e+"/").test(t)}).forEach(function(e){return t(e)})})}),require.register("initializers/environment",function(e,t,r){var s;s=t("config/environment"),r.exports=Ember.Application.initializer({name:"environment",initialize:function(e,t){return t.register("environment:main",s,{instantiate:!1,singleton:!0}),t.inject("controller","env","environment:main")}})}),require.register("mixins/auto-saving",function(e,t,r){var s;s=500,r.exports=App.AutoSaving=Ember.Mixin.create({_buffers:Ember.Map.create(),bufferedFields:[],instaSaveFields:[],_allFields:function(){return this.get("bufferedFields").concat(this.get("instaSaveFields"))}.property(),setUnknownProperty:function(e,t){return this.get("bufferedFields").contains(e)?(this.get("_buffers").set(e,t),this._debouncedSave()):this.get("instaSaveFields").contains(e)?(this._super(e,t),this._debouncedSave(!0)):this._super(e,t)},unknownProperty:function(e){return this.get("_allFields").contains(e)&&this._buffers.get(e)?this._buffers.get(e):this._super(e)},_autoSave:function(){return this.get("content.isSaving")?this._debouncedSave():(this.get("_buffers").forEach(function(e){return function(t,r){return e.get("content").set(t,r)}}(this)),this.set("_buffers",Ember.Map.create()),this.get("content").save().then(function(){return function(){return Ember.Logger.debug("auto saving %csucceeded","color: green")}}(this),function(e){return function(){return Ember.Logger.debug("auto saving %cfailed","color: red"),e.get("content").rollback()}}(this)))},_debouncedSave:function(e){return null==e&&(e=!1),Ember.run.debounce(this,this._autoSave,s,e)},_saveNowAndClear:function(){return this.get("content")?(this._debouncedSave(!0),this.set("_buffers",Ember.Map.create())):void 0}.observesBefore("content")})}),require.register("mixins/autosavable-controller",function(e,t,r){var s;s=1e3,r.exports=App.AutosavableController=Ember.Mixin.create({bufferedFields:[],instaSaveFields:[],_allFields:function(){return this.get("bufferedFields").concat(this.get("instaSaveFields"))}.property(),setUnknownProperty:function(e,t){return this.get("bufferedFields").contains(e)?(this.get("_buffers").set(e,t),this._debouncedSave()):this.get("instaSaveFields").contains(e)?(this._super(e,t),this._debouncedSave(!0)):this._super(e,t)},unknownProperty:function(e){return this.get("_allFields").contains(e)&&this.get("_buffers").get(e)?this.get("_buffers").get(e):this._super(e)},_save:function(){return this.get("content.isSaving")?this._debouncedSave():(Ember.Logger.debug("App.AutosavableController::_save: Saving changes..."),this.get("_buffers").forEach(function(e){return function(t,r){return e.get("content").set(t,r)}}(this)),this.set("_buffers",Ember.Map.create()),this.get("content").save().then(function(){return function(){return Ember.Logger.debug("App.AutosavableController::_save: Saving %csucceeded","color: green")}}(this),function(){return function(){return Ember.Logger.debug("App.AutosavableController::_save: Saving %cfailed","color: red")}}(this)))},_debouncedSave:function(e){return e||Ember.Logger.debug("App.AutosavableController::_debouncedSave: Save requested and scheduled:",s),Ember.run.debounce(this,this._save,s,e)},_saveNowAndClear:function(){return Ember.Logger.debug("App.AutosavableController::_saveNowAndClear: Clearing..."),this.get("content")&&!this.get("content.isDeleted")?(this._debouncedSave(!0),this.set("_buffers",Ember.Map.create())):void 0}.observesBefore("content"),actions:{save:function(){return this._debouncedSave(!0)}}})}),require.register("mixins/autosavable-model",function(e,t,r){r.exports=App.AutosavableModel=Ember.Mixin.create({_buffers:function(){return Ember.Map.create()}.property()})}),require.register("mixins/route-trailable",function(e,t,r){r.exports=App.RouteTrailable=Ember.Mixin.create({setupController:function(e,t){var r,s;return this._super(e,t),s=this.templateName||this.routeName,r=-1===s.indexOf(".")?s.split("/")[0]:s.split(".")[0],this.controllerFor("route-trail").set("model",{route:this.routeName,template:s,controller:e,parentTemplate:r,parentController:this.controllerFor(r)})}})}),require.register("models/project",function(e,t,r){App.Project=DS.Model.extend({workgroup:DS.belongsTo("workgroup"),name:DS.attr("string",{defaultValue:""})}),App.Project.FIXTURES=[{id:1,workgroup:1,name:"Project 1"},{id:2,workgroup:1,name:"Project 2"}],r.exports=App.Project}),require.register("models/task",function(e,t,r){App.Task=DS.Model.extend(App.AutosavableModel,{workgroup:DS.belongsTo("workgroup"),name:DS.attr("string",{defaultValue:""}),body:DS.attr("string",{defaultValue:""}),completed:DS.attr("boolean",{defaultValue:!1})}),App.Task.FIXTURES=[{id:1,workgroup:1,name:"Autocomplete makes mentioning your teammates quick and painless.",body:"The Trello team actively participates on this board, and uses it to communicate with the outside world about its development priorities.",completed:!1},{id:2,workgroup:1,name:"Support for both Apple & Google emoji styles means it works everywhere.",body:"feature-ideas@trello.com is the address for contacting us about features. We know that it's not optimal to have an email address as a feature request queue, but Fog Creek as a business is very good at handling incoming email, and this is the best way to preserve the time and attention of our developers so that they can actually get things done. If your idea isn't here, email us!",completed:!1},{id:3,workgroup:1,name:"Configurable notifications for desktop, mobile push and email keep you as informed as you’d like.",body:"These are things, usually bugs, that we know about, but haven't had time to move into the schedule. In essence, they're pecadillos we're asking our users to live with.",completed:!1},{id:4,workgroup:1,name:"Support for private groups and 1:1 direct messaging gives you complete flexibility. Private things stay private, so just the right people see them.",body:"It can be difficult to see all the things that you're assigned to across many boards. Currently you have to open each board you're a member of and filter for your cards Additionally, this kind of overview would be helpful for you to see what other people have on their plate.",completed:!0},{id:5,workgroup:1,name:"The ”ambient awareness” that comes from increased transparency cuts down on the need for meetings.",body:"Card order within a list is meaningful. When you change the order of cards in a list, it means something and is reported in a notification. This presents special challenges for the design of any sorting functionality we might consider. When you sort, who sees it? You or everyone? Is it reported to everyone? What if you inadvertently sort and destroy a list order that was meaningful? Do we need to offer recovery/undo options? If sorting is just for finding cards, do we offer the ability to sort only for your current view of the interface? How do we reflect that to you so that you don't think you've re-sorted for everyone? What happens if someone changes the order of a list while you have it sorted? We would need to support sorting temporarily, for viewing, in which case you wouldn't be able to reorder the cards, and everyone else would see the current order, and \"solidifying\" that sort, which would be reported (\"Rich Armstrong reordered the Ideas list by Votes.\") There's clear value in being able to find things in lists, but sorting can be really problematic.",completed:!0},{id:6,workgroup:2,name:"Internal email becomes unnecessary as desktop & mobile messaging, file sharing and notifications fold into one place.",body:"When you have a lot of notifications, and you go to the dropdown and click on one, they count down to 0 (probably just because we're re-rendering on each mark-as-read) so if you're on a slow machine that takes a while.",completed:!1}],r.exports=App.Task}),require.register("models/workgroup",function(e,t,r){App.Workgroup=DS.Model.extend({name:DS.attr("string",{defaultValue:""}),tasks:DS.hasMany("task",{async:!0}),projects:DS.hasMany("project",{async:!0})}),App.Workgroup.FIXTURES=[{id:1,name:"Kinda Labs",tasks:[1,2,3,4,5],projects:[1,2]},{id:2,name:"Color Me Rad",tasks:[6],projects:[]},{id:3,name:"Kinda Labs - Development",tasks:[],projects:[]}],r.exports=App.Workgroup}),require.register("routes/index",function(e,t,r){r.exports=App.IndexRoute=Ember.Route.extend({model:function(){return this.store.find("workgroup")}})}),require.register("routes/task",function(e,t,r){r.exports=App.TaskRoute=Ember.Route.extend({renderTemplate:function(){var e;return e=this.controllerFor("route-trail"),e.get("model")&&(e.get("parentTemplate")?(this.render(e.get("parentTemplate"),{controller:e.get("parentController")}),this.render(e.get("template"),{controller:e.get("controller"),into:e.get("parentTemplate")})):this.render(e.get("template"),{controller:e.get("controller")})),this.render({outlet:"detail"})}})}),require.register("routes/tasks",function(e,t,r){r.exports=App.TasksRoute=Ember.Route.extend({model:function(){return this.modelFor("workgroup").get("tasks")}})}),require.register("routes/tasks/done",function(e,t,r){r.exports=App.TasksDoneRoute=Ember.Route.extend(App.RouteTrailable,{templateName:"tasks/todo",model:function(){return this.store.filter("task",function(e){return function(t){return t.get("workgroup")===e.modelFor("workgroup")&&t.get("completed")}}(this))}})}),require.register("routes/tasks/todo",function(e,t,r){r.exports=App.TasksTodoRoute=Ember.Route.extend(App.RouteTrailable,{model:function(){return this.store.filter("task",function(e){return function(t){return t.get("workgroup")===e.modelFor("workgroup")&&!t.get("completed")}}(this))}})}),require.register("routes/workgroup",function(e,t,r){r.exports=App.WorkgroupRoute=Ember.Route.extend({afterModel:function(e){return e.get("projects")},actions:{addTask:function(e){var t;if(!Ember.isBlank(e))return e=$.trim(e),t=this.store.createRecord("task",{workgroup:this.currentModel,name:e}),t.save().then(function(e){return function(){return e.currentModel.get("tasks").pushObject(t),Ember.Logger.debug("task saving %csucceeded","color: green")}}(this),function(e){return function(){return e.store.deleteRecord(t),Ember.Logger.debug("task saving %cfailed","color: red")}}(this)),this.controllerFor("tasks").clearForm(),this.transitionTo("task",t)}}})}),require.register("routes/workgroup/index",function(e,t,r){r.exports=App.WorkgroupIndexRoute=Ember.Route.extend({beforeModel:function(){return this.transitionTo("tasks.todo")}})}),require.register("templates/application",function(e,t,r){r.exports=Ember.TEMPLATES.application=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var o,a,i=this.escapeExpression;o={},a={},n.buffer.push(i(r._triageMustache.call(t,"outlet",{hash:{},contexts:[t],types:["ID"],hashContexts:a,hashTypes:o,data:n})))})}),require.register("templates/detail",function(e,t,r){r.exports=Ember.TEMPLATES.detail=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var o,a,i="",u=this.escapeExpression;return n.buffer.push('<div class="col-sm-9 col-sm-offset-3 col-md-5 detail animated bounceInRight">\n  '),o={},a={},n.buffer.push(u(r._triageMustache.call(t,"yield",{hash:{},contexts:[t],types:["ID"],hashContexts:a,hashTypes:o,data:n}))),n.buffer.push("\n</div>"),i})}),require.register("templates/error",function(e,t,r){r.exports=Ember.TEMPLATES.error=Ember.Handlebars.template(function(e,t,r,s,n){function o(e,t){var s,n,o="";return t.buffer.push("\n        <pre>\n          "),s={},n={},t.buffer.push(p(r._triageMustache.call(e,"stack",{hash:{},contexts:[e],types:["ID"],hashContexts:n,hashTypes:s,data:t}))),t.buffer.push("\n        </pre>\n      "),o}this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var a,i,u,l="",p=this.escapeExpression,c=this;return n.buffer.push('<div class="container">\n  <div class="row">\n    <div class="col-md-6 col-md-offset-3">\n      <h2>Sorry, Something went wrong</h2>\n      <p>'),i={},u={},n.buffer.push(p(r._triageMustache.call(t,"message",{hash:{},contexts:[t],types:["ID"],hashContexts:u,hashTypes:i,data:n}))),n.buffer.push("</p>\n      "),i={},u={},a=r["if"].call(t,"stack",{hash:{},inverse:c.noop,fn:c.program(1,o,n),contexts:[t],types:["ID"],hashContexts:u,hashTypes:i,data:n}),(a||0===a)&&n.buffer.push(a),n.buffer.push("\n    </div>\n  </div>\n</div>"),l})}),require.register("templates/index",function(e,t,r){r.exports=Ember.TEMPLATES.index=Ember.Handlebars.template(function(e,t,r,s,n){function o(e,t){var s,n,o,i,u,l="";return t.buffer.push("\n          "),o={"class":e},i={"class":"STRING"},u={hash:{"class":"list-group-item"},inverse:h.noop,fn:h.program(2,a,t),contexts:[e,e],types:["STRING","ID"],hashContexts:o,hashTypes:i,data:t},s=r["link-to"]||e&&e["link-to"],n=s?s.call(e,"workgroup","",u):d.call(e,"link-to","workgroup","",u),(n||0===n)&&t.buffer.push(n),t.buffer.push("\n        "),l}function a(e,t){var s,n,o="";return t.buffer.push('\n            <h4 class="list-group-item-heading">'),s={},n={},t.buffer.push(c(r._triageMustache.call(e,"name",{hash:{},contexts:[e],types:["ID"],hashContexts:n,hashTypes:s,data:t}))),t.buffer.push('</h4>\n            <p class="list-group-item-text">a list of member goes here.</p>\n          '),o}this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var i,u,l,p="",c=this.escapeExpression,h=this,d=r.helperMissing;return n.buffer.push('<div class="container">\n  <div class="row">\n    <div class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">\n      <div class="page-header">\n        <h2>Workgroups</h2>\n      </div>\n\n      <div class="list-group">\n        '),u={},l={},i=r.each.call(t,"content",{hash:{},inverse:h.noop,fn:h.program(1,o,n),contexts:[t],types:["ID"],hashContexts:l,hashTypes:u,data:n}),(i||0===i)&&n.buffer.push(i),n.buffer.push("\n      </div>\n    </div>\n  </div>\n</div>"),p})}),require.register("templates/loading",function(e,t,r){r.exports=Ember.TEMPLATES.loading=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{},n.buffer.push('<h5 class="text-center">Loading&hellip;</h5>')})}),require.register("templates/task",function(e,t,r){r.exports=Ember.TEMPLATES.task=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var o,a,i,u,l="",p=r.helperMissing,c=this.escapeExpression;return n.buffer.push('<header>\n  <div class="page-header">\n    <h4>Task Detail</h4>\n  </div>\n</header>\n\n<div class="form-group">\n  '),a={type:t,checked:t},i={type:"STRING",checked:"ID"},u={hash:{type:"checkbox",checked:"completed"},contexts:[],types:[],hashContexts:a,hashTypes:i,data:n},n.buffer.push(c((o=r.input||t&&t.input,o?o.call(t,u):p.call(t,"input",u)))),n.buffer.push('\n</div>\n\n<div class="form-group">\n  '),a={type:t,"class":t,value:t},i={type:"STRING","class":"STRING",value:"ID"},u={hash:{type:"text","class":"form-control",value:"name"},contexts:[],types:[],hashContexts:a,hashTypes:i,data:n},n.buffer.push(c((o=r.input||t&&t.input,o?o.call(t,u):p.call(t,"input",u)))),n.buffer.push('\n</div>\n\n<div class="form-group">\n  '),a={value:t,"class":t,rows:t},i={value:"ID","class":"STRING",rows:"STRING"},u={hash:{value:"body","class":"form-control",rows:"20"},contexts:[],types:[],hashContexts:a,hashTypes:i,data:n},n.buffer.push(c((o=r.textarea||t&&t.textarea,o?o.call(t,u):p.call(t,"textarea",u)))),n.buffer.push("\n</div>"),l})}),require.register("templates/tasks",function(e,t,r){r.exports=Ember.TEMPLATES.tasks=Ember.Handlebars.template(function(e,t,r,s,n){function o(e,t){t.buffer.push("To-do")}function a(e,t){t.buffer.push("Done")}this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var i,u,l,p,c,h="",d=this,f=r.helperMissing,m=this.escapeExpression;return n.buffer.push('<header>\n  <div class="page-header">\n    <h4>Tasks</h4>\n  </div>\n\n  <ul class="nav nav-tabs">\n    <li>'),l={},p={},c={hash:{},inverse:d.noop,fn:d.program(1,o,n),contexts:[t],types:["STRING"],hashContexts:p,hashTypes:l,data:n},i=r["link-to"]||t&&t["link-to"],u=i?i.call(t,"tasks.todo",c):f.call(t,"link-to","tasks.todo",c),(u||0===u)&&n.buffer.push(u),n.buffer.push("</li>\n    <li>"),l={},p={},c={hash:{},inverse:d.noop,fn:d.program(3,a,n),contexts:[t],types:["STRING"],hashContexts:p,hashTypes:l,data:n},i=r["link-to"]||t&&t["link-to"],u=i?i.call(t,"tasks.done",c):f.call(t,"link-to","tasks.done",c),(u||0===u)&&n.buffer.push(u),n.buffer.push('</li>\n    <li class="dropdown pull-right">\n      <a class="dropdown-toggle" data-toggle="dropdown" href="#">\n        Sort by Due <span class="caret"></span>\n      </a>\n      <ul class="dropdown-menu">\n        <li><a href="#">Sort by Project</a></li>\n        <li><a href="#">Sort by Member</a></li>\n      </ul>\n    </li>\n  </ul>\n\n  '),p={type:t,"class":t,placeholder:t,value:t,"insert-newline":t},l={type:"STRING","class":"STRING",placeholder:"STRING",value:"ID","insert-newline":"STRING"},c={hash:{type:"text","class":"form-control",placeholder:"Thing To Do",value:"newTaskName","insert-newline":"addTask"},contexts:[],types:[],hashContexts:p,hashTypes:l,data:n},n.buffer.push(m((i=r.input||t&&t.input,i?i.call(t,c):f.call(t,"input",c)))),n.buffer.push("\n</header>\n\n"),l={},p={},n.buffer.push(m(r._triageMustache.call(t,"outlet",{hash:{},contexts:[t],types:["ID"],hashContexts:p,hashTypes:l,data:n}))),h})}),require.register("templates/tasks/loading",function(e,t,r){r.exports=Ember.TEMPLATES["tasks/loading"]=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{},n.buffer.push('<h5 class="text-center">Loading&hellip;</h5>')})}),require.register("templates/tasks/todo",function(e,t,r){r.exports=Ember.TEMPLATES["tasks/todo"]=Ember.Handlebars.template(function(e,t,r,s,n){function o(e,t){var s,n,o,u,l,p="";return t.buffer.push('\n    <div class="list-group-item">\n      <div class="row">\n        <div class="col-xs-1">\n          '),o={type:e,checked:e},u={type:"STRING",checked:"ID"},l={hash:{type:"checkbox",checked:"completed"},contexts:[],types:[],hashContexts:o,hashTypes:u,data:t},t.buffer.push(d((s=r.input||e&&e.input,s?s.call(e,l):f.call(e,"input",l)))),t.buffer.push('\n        </div>\n        <div class="col-xs-11">\n          <p class="list-group-item-heading">\n\n            '),u={},o={},l={hash:{},inverse:m.noop,fn:m.program(2,a,t),contexts:[e,e],types:["STRING","ID"],hashContexts:o,hashTypes:u,data:t},s=r["link-to"]||e&&e["link-to"],n=s?s.call(e,"task","",l):f.call(e,"link-to","task","",l),(n||0===n)&&t.buffer.push(n),t.buffer.push("\n            "),u={},o={},n=r["if"].call(e,"isSaving",{hash:{},inverse:m.noop,fn:m.program(4,i,t),contexts:[e],types:["ID"],hashContexts:o,hashTypes:u,data:t}),(n||0===n)&&t.buffer.push(n),t.buffer.push('\n          </p>\n          <p class="list-group-item-text">\n            <small>Sep 20 &bull; <a href="#">Kolabo Works</a> &bull; 2 subscribers</small>\n          </p>\n        </div>\n      </div>\n\n    </div>\n  '),p}function a(e,t){var s,n;s={},n={},t.buffer.push(d(r._triageMustache.call(e,"name",{hash:{},contexts:[e],types:["ID"],hashContexts:n,hashTypes:s,data:t})))}function i(e,t){t.buffer.push('<i class="fa fa-spinner fa-spin"></i>')}function u(e,t){t.buffer.push('\n    <p class="text-center">No tasks</p>\n  ')}this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var l,p,c,h="",d=this.escapeExpression,f=r.helperMissing,m=this;return n.buffer.push('<div class="list-group">\n  <h5 class="page-header">No Due</h5>\n\n  '),p={itemController:t},c={itemController:"STRING"},l=r.each.call(t,"content",{hash:{itemController:"task"},inverse:m.program(6,u,n),fn:m.program(1,o,n),contexts:[t],types:["ID"],hashContexts:p,hashTypes:c,data:n}),(l||0===l)&&n.buffer.push(l),n.buffer.push("\n</div>"),h})}),require.register("templates/workgroup",function(e,t,r){r.exports=Ember.TEMPLATES.workgroup=Ember.Handlebars.template(function(e,t,r,s,n){function o(e,t){t.buffer.push('<i class="fa fa-arrow-circle-left"></i> Go back to dashboard')}function a(e,t){t.buffer.push("Tasks")}function i(e,t){var s,n,o,a,i,l="";return t.buffer.push("\n          <li>"),o={},a={},i={hash:{},inverse:g.noop,fn:g.program(6,u,t),contexts:[e,e],types:["STRING","ID"],hashContexts:a,hashTypes:o,data:t},s=r["link-to"]||e&&e["link-to"],n=s?s.call(e,"project","",i):b.call(e,"link-to","project","",i),(n||0===n)&&t.buffer.push(n),t.buffer.push("</li>\n        "),l}function u(e,t){var s,n;s={},n={},t.buffer.push(m(r._triageMustache.call(e,"name",{hash:{},contexts:[e],types:["ID"],hashContexts:n,hashTypes:s,data:t})))}this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{};var l,p,c,h,d,f="",m=this.escapeExpression,g=this,b=r.helperMissing;return n.buffer.push('<div class="container-fluid">\n  <div class="row">\n    <div class="col-sm-3 col-md-2 sidebar">\n      <h5>'),c={},h={},d={hash:{},inverse:g.noop,fn:g.program(1,o,n),contexts:[t],types:["STRING"],hashContexts:h,hashTypes:c,data:n},l=r["link-to"]||t&&t["link-to"],p=l?l.call(t,"index",d):b.call(t,"link-to","index",d),(p||0===p)&&n.buffer.push(p),n.buffer.push('</h5>\n\n      <div class="page-header">\n        <h4>'),c={},h={},n.buffer.push(m(r._triageMustache.call(t,"name",{hash:{},contexts:[t],types:["ID"],hashContexts:h,hashTypes:c,data:n}))),n.buffer.push('</h4>\n      </div>\n\n      <ul class="nav nav-pills nav-stacked">\n        <li>'),h={currentWhen:t},c={currentWhen:"STRING"},d={hash:{currentWhen:"tasks.todo|tasks.done|task"},inverse:g.noop,fn:g.program(3,a,n),contexts:[t],types:["STRING"],hashContexts:h,hashTypes:c,data:n},l=r["link-to"]||t&&t["link-to"],p=l?l.call(t,"tasks.todo",d):b.call(t,"link-to","tasks.todo",d),(p||0===p)&&n.buffer.push(p),n.buffer.push('</li>\n        <li><a href="#">Calendar</a></li>\n        <li><a href="#">Discussions</a></li>\n        <li><a href="#">Notes</a></li>\n      </ul>\n\n      <div class="page-header">\n        <h4>Projects</h4>\n      </div>\n\n      <ul class="nav nav-pills nav-stacked">\n        '),c={},h={},p=r.each.call(t,"projects",{hash:{},inverse:g.noop,fn:g.program(5,i,n),contexts:[t],types:["ID"],hashContexts:h,hashTypes:c,data:n}),(p||0===p)&&n.buffer.push(p),n.buffer.push('\n      </ul>\n    </div>\n    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">\n      '),c={},h={},n.buffer.push(m(r._triageMustache.call(t,"outlet",{hash:{},contexts:[t],types:["ID"],hashContexts:h,hashTypes:c,data:n}))),n.buffer.push("\n    </div>\n    \n    "),c={},h={},d={hash:{},contexts:[t],types:["STRING"],hashContexts:h,hashTypes:c,data:n},n.buffer.push(m((l=r.outlet||t&&t.outlet,l?l.call(t,"detail",d):b.call(t,"outlet","detail",d)))),n.buffer.push("\n    \n  </div>\n</div>"),f})}),require.register("templates/workgroup/index",function(e,t,r){r.exports=Ember.TEMPLATES["workgroup/index"]=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{},n.buffer.push("<p>workgroup/index.hbs</p>")})}),require.register("templates/workgroup/loading",function(e,t,r){r.exports=Ember.TEMPLATES["workgroup/loading"]=Ember.Handlebars.template(function(e,t,r,s,n){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,Ember.Handlebars.helpers),n=n||{},n.buffer.push('<h5 class="text-center">Loading&hellip;</h5>')})}),require.register("utils/debounce",function(e,t,r){r.exports=App.debounce=function(e,t){var r;return r=null,function(){var s,n,o,a,i;return n=this,s=arguments,a=s[s.length-1],a&&a.now&&(o=!0),i=function(){return r=null,e.apply(n,s)},clearTimeout(r),o?e.apply(n,s):r=setTimeout(i,t)}}}),require.register("views/task",function(e,t,r){r.exports=App.TaskView=Ember.View.extend({layoutName:"detail",willInsertElement:function(){return $(".main").removeClass("col-md-10").addClass("col-md-5")},willDestroyElement:function(){return $(".main").removeClass("col-md-5").addClass("col-md-10")}})}),require.register("config/environments/production",function(){window.TAPAS_ENV={name:"production"}});