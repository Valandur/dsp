(this.webpackJsonpdsp=this.webpackJsonpdsp||[]).push([[0],{16:function(e,t,i){},17:function(e,t,i){},18:function(e,t,i){"use strict";i.r(t);var n,a=i(0),s=i(1),r=i.n(s),c=i(10),m=i.n(c),u=(i(16),i(7)),o=i(4),d=i(2),l=i(6),p=(i(17),i(9)),b=new Map,j=Object(l.a)(p);try{for(j.s();!(n=j.n()).done;){var h,_=n.value,g=Object(l.a)(_.outputs);try{for(g.s();!(h=g.n()).done;){var O=h.value,v=b.get(O.id);v||(v={id:O.id,asInput:[],asOutput:[]},b.set(O.id,v)),v.asOutput.push(_)}}catch(B){g.e(B)}finally{g.f()}var x,f=Object(l.a)(_.inputs);try{for(f.s();!(x=f.n()).done;){var N=x.value,y=b.get(N.id);y||(y={id:N.id,asInput:[],asOutput:[]},b.set(N.id,y)),y.asInput.push(_)}}catch(B){f.e(B)}finally{f.f()}}}catch(B){j.e(B)}finally{j.f()}var C=Object(d.a)(b.values()).sort((function(e,t){return e.id.localeCompare(t.id)})),w=function(){var e=Object(s.useState)([]),t=Object(o.a)(e,2),i=t[0],n=t[1],r=Object(s.useState)(new Map),c=Object(o.a)(r,2),m=c[0],j=c[1],h=Object(s.useState)("electromagnetic_matrix"),_=Object(o.a)(h,2),g=_[0],O=_[1],v=Object(s.useState)(1),x=Object(o.a)(v,2),f=x[0],N=x[1],y=Object(s.useState)(60),w=Object(o.a)(y,2),k=w[0],M=w[1],S=Object(s.useCallback)((function(e,t){j((function(i){return new Map(i.set(e,Object(u.a)(Object(u.a)({id:e},i.get(e)),t)))}))}),[]),I=Object(s.useCallback)((function(e){return(e*k).toFixed(1)}),[k]);return Object(s.useEffect)((function(){for(var e=new Map,t=Object(d.a)(m.values()).filter((function(e){return!e.disabled})).map((function(e){return Object(u.a)(Object(u.a)({},e),{},{implicit:!1})})),i=0,a=function(){var n;i++;var a=t.shift();if(!a||i>1e3)return"break";var s=null===(n=b.get(a.id))||void 0===n?void 0:n.asOutput;if(!s||0===s.length)return"continue";var r=e.get(a.id);r||(r={id:a.id,recipe:null,implicit:!0,external:!1,usedBy:new Map,uses:new Map},e.set(r.id,r));var c=r.recipe||s.find((function(e){return e.name===a.recipe}))||s[0];if(r.recipe||(r.recipe=c),a.external)return r.external=!0,"continue";if(!a.rate)return"continue";a.implicit||(r.implicit=!1,r.usedBy.set(a.id,(r.usedBy.get(a.id)||0)+a.rate));var m,u=c.outputs.find((function(e){return e.id===a.id})).amount/c.time,o=Object(l.a)(c.inputs);try{for(o.s();!(m=o.n()).done;){var d=m.value,p=a.rate/u*(d.amount/c.time);if(r.uses.set(d.id,(r.uses.get(d.id)||0)+p),!r.external){var j=e.get(d.id);if(j||(j={id:d.id,recipe:null,implicit:!0,external:!1,usedBy:new Map,uses:new Map},e.set(j.id,j)),r.id===j.id)continue;j.usedBy.set(a.id,(j.usedBy.get(a.id)||0)+p),t.push({id:d.id,rate:p,recipe:c.name,disabled:!1,implicit:!0,external:!1})}}}catch(B){o.e(B)}finally{o.f()}};t.length>0;){var s=a();if("break"===s)break}n(Object(d.a)(e.values()))}),[m]),Object(a.jsxs)("div",{id:"main",children:[Object(a.jsx)("h1",{children:"Dyson Sphere Program"}),Object(a.jsxs)("div",{id:"settings",children:[Object(a.jsx)("h2",{children:"Settings"}),Object(a.jsxs)("div",{className:"settings-item",children:[Object(a.jsx)("div",{className:"settings-item--name",children:"Rate [s]"}),Object(a.jsx)("div",{className:"settings-item--value",children:Object(a.jsx)("input",{type:"number",value:k,onChange:function(e){return M(Number(e.target.value))}})})]})]}),Object(a.jsxs)("div",{id:"plan",children:[Object(a.jsx)("h2",{children:"Planner"}),Object(a.jsxs)("div",{className:"plan-item-header",children:[Object(a.jsx)("div",{className:"plan-item--item",children:"Item"}),Object(a.jsxs)("div",{className:"plan-item--rate",children:["Target rate [1/",k,"s]"]}),Object(a.jsx)("div",{className:"plan-item--action"})]}),Object(a.jsxs)("div",{className:"plan-item",children:[Object(a.jsx)("div",{className:"plan-item--item",children:Object(a.jsx)("select",{value:g,onChange:function(e){return O(e.target.value)},children:C.map((function(e){return Object(a.jsx)("option",{value:e.id,children:e.id},e.id)}))})}),Object(a.jsx)("div",{className:"plan-item--rate",children:Object(a.jsx)("input",{type:"number",placeholder:"Target rate",value:f*k,onChange:function(e){return N(Number(e.target.value)/k)}})}),Object(a.jsx)("div",{className:"plan-item--action",children:Object(a.jsx)("button",{onClick:function(){return S(g,{disabled:!1,rate:f})},children:"+"})})]}),Object(d.a)(m.values()).filter((function(e){return!!e.rate||e.recipe})).map((function(e){return Object(a.jsxs)("div",{className:"plan-item"+(e.disabled?" disabled":""),children:[Object(a.jsx)("div",{className:"plan-item--item",children:e.id}),Object(a.jsx)("div",{className:"plan-item--rate",children:e.rate&&e.rate*k}),Object(a.jsxs)("div",{className:"plan-item--action",children:[Object(a.jsx)("button",{onClick:function(){return S(e.id,{disabled:!e.disabled})},children:"T"})," ",Object(a.jsx)("button",{onClick:function(){return S(e.id,{rate:void 0})},children:"-"})]})]},e.id)}))]}),Object(a.jsxs)("div",{id:"resources",children:[Object(a.jsx)("h2",{children:"Resources"}),Object(a.jsxs)("div",{className:"resources-item-header",children:[Object(a.jsx)("div",{className:"resources-item--action"}),Object(a.jsx)("div",{className:"resources-item--item",children:"Item"}),Object(a.jsxs)("div",{className:"resources-item--rate",children:["Rate [1/",k,"s]"]}),Object(a.jsx)("div",{className:"resources-item--rate",children:"Machines"}),Object(a.jsx)("div",{className:"resources-item--uses",children:"Uses"}),Object(a.jsx)("div",{className:"resources-item--usedby",children:"Used By"})]}),i.filter((function(e){return e.usedBy.size>0})).map((function(e){var t,i,n=Object(d.a)(e.uses.entries()).map((function(e){return{id:e[0],rate:e[1]}})),s=Object(d.a)(e.usedBy.entries()).map((function(e){return{id:e[0],rate:e[1]}})),r=s.reduce((function(e,t){return e+t.rate}),0),c=null===(t=b.get(e.id))||void 0===t?void 0:t.asOutput,m=e.recipe?e.recipe.outputs.find((function(t){return t.id===e.id})).amount/e.recipe.time:1,u="resources-item"+(e.implicit?"":" explicit")+(e.external?" external":"");return Object(a.jsxs)("div",{className:u,children:[Object(a.jsxs)("div",{className:"resources-item--action",children:[e.implicit?Object(a.jsx)("button",{onClick:function(){return S(e.id,{external:!e.external})},children:"E"}):Object(a.jsx)("div",{}),c&&c.length>1&&Object(a.jsx)("select",{value:null===(i=e.recipe)||void 0===i?void 0:i.name,onChange:function(t){return S(e.id,{recipe:t.target.value})},children:c.map((function(e){return Object(a.jsx)("option",{value:e.name,children:e.name},e.name)}))})]}),Object(a.jsx)("div",{className:"resources-item--item",children:e.id}),Object(a.jsx)("div",{className:"resources-item--rate",children:I(r)}),Object(a.jsx)("div",{className:"resources-item--machines",children:e.recipe&&Object(a.jsxs)(a.Fragment,{children:[Math.round(r/m*10)/10,"x ",e.recipe.machine]})}),Object(a.jsx)("div",{className:"resources-item--uses",children:n.map((function(t){return Object(a.jsxs)("div",{className:"resources-item--uses-item"+(t.id===e.id?" recursive":""),children:[Object(a.jsx)("div",{className:"resources-item--uses-item--rate",children:I(t.rate)}),Object(a.jsxs)("div",{className:"resources-item--uses-item--name",children:[t.id,t.id===e.id&&" \ud83d\udd01"]})]},t.id)}))}),Object(a.jsxs)("div",{className:"resources-item--usedby",children:[!e.implicit&&Object(a.jsxs)("div",{className:"resources-item--usedby-item",children:[Object(a.jsx)("div",{className:"resources-item--usedby-item--rate",children:I(s.find((function(t){return t.id===e.id})).rate)}),Object(a.jsx)("div",{className:"resources-item--usedby-item--name",children:"Planner"})]}),s.filter((function(t){return t.id!==e.id})).map((function(e){return Object(a.jsxs)("div",{className:"resources-item--usedby-item",children:[Object(a.jsx)("div",{className:"resources-item--usedby-item--rate",children:I(e.rate)}),Object(a.jsx)("div",{className:"resources-item--usedby-item--name",children:e.id})]},e.id)}))]})]},e.id)}))]}),Object(a.jsxs)("div",{id:"recipes",children:[Object(a.jsx)("h2",{children:"Recipes"}),Object(a.jsxs)("div",{className:"recipes-item-header",children:[Object(a.jsx)("div",{className:"recipes-item--name",children:"Name"}),Object(a.jsx)("div",{className:"recipes-item--inputs",children:"Inputs [1/min]"}),Object(a.jsx)("div",{className:"recipes-item--outputs",children:"Outputs [1/min]"})]}),p.map((function(e,t){return Object(a.jsxs)("div",{className:"recipes-item",children:[Object(a.jsx)("div",{className:"recipes-item--name",children:e.name}),Object(a.jsx)("div",{className:"recipes-item--inputs",children:e.inputs.map((function(t){return Object(a.jsxs)("div",{className:"recipes-item--inputs-item",children:[Object(a.jsx)("div",{className:"recipes-item--inputs-item--amount",children:60*t.amount/e.time}),Object(a.jsx)("div",{className:"recipes-item--inputs-item--name",children:t.id})]},t.id)}))}),Object(a.jsx)("div",{className:"recipes-item--outputs",children:e.outputs.map((function(t){return Object(a.jsxs)("div",{className:"recipes-item--outputs-item",children:[Object(a.jsx)("div",{className:"recipes-item--outputs-item--amount",children:60*t.amount/e.time}),Object(a.jsx)("div",{className:"recipes-item--outputs-item--name",children:t.id})]},t.id)}))})]},t)}))]})]})},k=function(e){e&&e instanceof Function&&i.e(3).then(i.bind(null,19)).then((function(t){var i=t.getCLS,n=t.getFID,a=t.getFCP,s=t.getLCP,r=t.getTTFB;i(e),n(e),a(e),s(e),r(e)}))};m.a.render(Object(a.jsx)(r.a.StrictMode,{children:Object(a.jsx)(w,{})}),document.getElementById("root")),k()},9:function(e){e.exports=JSON.parse('[{"name":"iron_ingot","inputs":[{"id":"iron_ore","amount":1}],"outputs":[{"id":"iron_ingot","amount":1}],"time":1,"machine":"smelter"},{"name":"copper_ingot","inputs":[{"id":"copper_ore","amount":1}],"outputs":[{"id":"copper_ingot","amount":1}],"time":1,"machine":"smelter"},{"name":"high_purity_silicon","inputs":[{"id":"silicon_ore","amount":2}],"outputs":[{"id":"high_purity_silicon","amount":1}],"time":2,"machine":"smelter"},{"name":"titanium_ingot","inputs":[{"id":"titanium_ore","amount":2}],"outputs":[{"id":"titanium_ingot","amount":1}],"time":2,"machine":"smelter"},{"name":"stone","inputs":[{"id":"stone_ore","amount":1}],"outputs":[{"id":"stone","amount":1}],"time":1,"machine":"smelter"},{"name":"energetic_graphite","inputs":[{"id":"coal_ore","amount":2}],"outputs":[{"id":"energetic_graphite","amount":1}],"time":2,"machine":"smelter"},{"name":"Plasma Refining","inputs":[{"id":"crude_oil","amount":2}],"outputs":[{"id":"hydrogen","amount":1},{"id":"refined_oil","amount":2}],"time":4,"machine":"oil_refinery"},{"name":"plastic","inputs":[{"id":"refined_oil","amount":2},{"id":"energetic_graphite","amount":1}],"outputs":[{"id":"plastic","amount":1}],"time":3,"machine":"chemical_lab"},{"name":"graphene","inputs":[{"id":"sulfuric_acid","amount":1},{"id":"energetic_graphite","amount":3}],"outputs":[{"id":"graphene","amount":2}],"time":3,"machine":"chemical_lab"},{"name":"magnet","inputs":[{"id":"iron_ore","amount":1}],"outputs":[{"id":"magnet","amount":1}],"time":1.5,"machine":"smelter"},{"name":"magnetic_coil","inputs":[{"id":"magnet","amount":2},{"id":"copper_ingot","amount":1}],"outputs":[{"id":"magnetic_coil","amount":2}],"time":1,"machine":"assembler"},{"name":"titanium_alloy","inputs":[{"id":"titanium_ingot","amount":4},{"id":"steel","amount":4},{"id":"sulfuric_acid","amount":8}],"outputs":[{"id":"titanium_alloy","amount":4}],"time":12,"machine":"smelter"},{"name":"glass","inputs":[{"id":"stone_ore","amount":2}],"outputs":[{"id":"glass","amount":1}],"time":2,"machine":"smelter"},{"name":"diamond","inputs":[{"id":"energetic_graphite","amount":1}],"outputs":[{"id":"diamond","amount":1}],"time":2,"machine":"smelter"},{"name":"X-Ray Cracking","inputs":[{"id":"hydrogen","amount":2},{"id":"refined_oil","amount":1}],"outputs":[{"id":"hydrogen","amount":3},{"id":"energetic_graphite","amount":1}],"time":4,"machine":"oil_refinery"},{"name":"organic_crystal","inputs":[{"id":"plastic","amount":2},{"id":"refined_oil","amount":1},{"id":"water","amount":1}],"outputs":[{"id":"organic_crystal","amount":1}],"time":6,"machine":"chemical_lab"},{"name":"steel","inputs":[{"id":"iron_ingot","amount":3}],"outputs":[{"id":"steel","amount":1}],"time":3,"machine":"smelter"},{"name":"electric_motor","inputs":[{"id":"iron_ingot","amount":2},{"id":"gear","amount":1},{"id":"magnetic_coil","amount":1}],"outputs":[{"id":"electric_motor","amount":1}],"time":2,"machine":"assembler"},{"name":"prism","inputs":[{"id":"glass","amount":3}],"outputs":[{"id":"prism","amount":2}],"time":2,"machine":"assembler"},{"name":"titanium_crystal","inputs":[{"id":"titanium_ingot","amount":3},{"id":"organic_crystal","amount":1}],"outputs":[{"id":"titanium_crystal","amount":1}],"time":4,"machine":"assembler"},{"name":"strange_matter","inputs":[{"id":"particle_container","amount":2},{"id":"iron_ingot","amount":2},{"id":"deuterium","amount":10}],"outputs":[{"id":"strange_matter","amount":1}],"time":8,"machine":"particle_collider"},{"name":"gear","inputs":[{"id":"iron_ingot","amount":1}],"outputs":[{"id":"gear","amount":1}],"time":1,"machine":"assembler"},{"name":"electromagnetic_turbine","inputs":[{"id":"electric_motor","amount":2},{"id":"magnetic_coil","amount":2}],"outputs":[{"id":"electromagnetic_turbine","amount":1}],"time":2,"machine":"assembler"},{"name":"circuit_board","inputs":[{"id":"copper_ingot","amount":1},{"id":"iron_ingot","amount":2}],"outputs":[{"id":"circuit_board","amount":2}],"time":1,"machine":"assembler"},{"name":"graviton_lens","inputs":[{"id":"diamond","amount":4},{"id":"strange_matter","amount":1}],"outputs":[{"id":"graviton_lens","amount":1}],"time":6,"machine":"assembler"},{"name":"sulfuric_acid","inputs":[{"id":"refined_oil","amount":6},{"id":"stone_ore","amount":8},{"id":"water","amount":4}],"outputs":[{"id":"sulfuric_acid","amount":4}],"time":6,"machine":"chemical_lab"},{"name":"deuterium","inputs":[{"id":"hydrogen","amount":10}],"outputs":[{"id":"deuterium","amount":5}],"time":5,"machine":"particle_collider"},{"name":"carbon_nanotube","inputs":[{"id":"graphene","amount":3},{"id":"titanium_ingot","amount":1}],"outputs":[{"id":"carbon_nanotube","amount":2}],"time":4,"machine":"chemical_lab"},{"name":"super_magnetic_ring","inputs":[{"id":"electromagnetic_turbine","amount":2},{"id":"magnet","amount":3},{"id":"energetic_graphite","amount":1}],"outputs":[{"id":"super_magnetic_ring","amount":1}],"time":3,"machine":"assembler"},{"name":"particle_broadband","inputs":[{"id":"carbon_nanotube","amount":2},{"id":"crystal_silicon","amount":2},{"id":"plastic","amount":1}],"outputs":[{"id":"particle_broadband","amount":1}],"time":8,"machine":"assembler"},{"name":"processor","inputs":[{"id":"circuit_board","amount":2},{"id":"microcrystalline_component","amount":2}],"outputs":[{"id":"processor","amount":1}],"time":3,"machine":"assembler"},{"name":"particle_container","inputs":[{"id":"electromagnetic_turbine","amount":2},{"id":"copper_ingot","amount":2},{"id":"graphene","amount":2}],"outputs":[{"id":"particle_container","amount":1}],"time":4,"machine":"assembler"},{"name":"space_warper","inputs":[{"id":"graviton_lens","amount":1}],"outputs":[{"id":"space_warper","amount":1}],"time":10,"machine":"assembler"},{"name":"solar_sail","inputs":[{"id":"graphene","amount":1},{"id":"photon_combiner","amount":1}],"outputs":[{"id":"solar_sail","amount":2}],"time":4,"machine":"assembler"},{"name":"photon_combiner","inputs":[{"id":"circuit_board","amount":1},{"id":"prism","amount":2}],"outputs":[{"id":"photon_combiner","amount":1}],"time":3,"machine":"assembler"},{"name":"microcrystalline_component","inputs":[{"id":"high_purity_silicon","amount":2},{"id":"copper_ingot","amount":1}],"outputs":[{"id":"microcrystalline_component","amount":1}],"time":2,"machine":"assembler"},{"name":"electromagnetic_matrix","inputs":[{"id":"magnetic_coil","amount":1},{"id":"circuit_board","amount":1}],"outputs":[{"id":"electromagnetic_matrix","amount":1}],"time":3,"machine":"matrix_lab"},{"name":"energy_matrix","inputs":[{"id":"energetic_graphite","amount":2},{"id":"hydrogen","amount":2}],"outputs":[{"id":"energy_matrix","amount":1}],"time":6,"machine":"matrix_lab"},{"name":"structure_matrix","inputs":[{"id":"diamond","amount":1},{"id":"titanium_crystal","amount":1}],"outputs":[{"id":"structure_matrix","amount":1}],"time":8,"machine":"matrix_lab"},{"name":"information_matrix","inputs":[{"id":"processor","amount":2},{"id":"particle_broadband","amount":1}],"outputs":[{"id":"information_matrix","amount":1}],"time":10,"machine":"matrix_lab"}]')}},[[18,1,2]]]);
//# sourceMappingURL=main.543dc3fe.chunk.js.map