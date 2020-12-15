(()=>{"use strict";const e=(e,t,a={})=>{const o=document.createElement(`${t}`);if(a)for(let e in a){let t=a[e];e in o?o[e]=t:(o.setAttribute(e,t),console.log(o),console.log(`used setAttribute for ${e}: ${t}`))}return e&&e.appendChild(o),o},t=(t,a,o)=>{const r=e(t,"select",{...a}),s={};return o.forEach((t=>{const a=e(r,"option",{...t});s[t.value]=a})),{selectElement:r,...s}},a=e=>{const t=new Date;let a=e-t.getDay();a<0&&(a+=7);let o=new Date;return o.setDate(t.getDate()+a),o.setHours(23,59,59),o},o=(e,t,a="default")=>e?new Intl.DateTimeFormat(a,t).format(new Date(e)):e,r=()=>{let e=(new Date).setDate((new Date).getDate()-14),t=((new Date).setMonth((new Date).getMonth()+3)-e)*Math.random();return i(e+Math.floor(t))},s=(e,t)=>{let a={dueDate:{}};return e&&(a.dueDate.lowerBound=e),t&&(a.dueDate.upperBound=t),a},i=e=>e?((e=new Date(e)).setHours(0,0,0,0),e.toISOString()):e,n=e=>{if(e)return(e=new Date(e)).getTime()},l=()=>!document.querySelector(".overdue"),c=e=>!!document.querySelector(e),d=(e,t)=>{const a="collapsed-height",o="expanded-height";"string"==typeof t&&(t=document.querySelector(t)),t&&("expand"==e?(t.classList.add(o),t.classList.remove(a)):"collapse"==e?(t.classList.add(a),t.classList.remove(o)):"toggle"==e&&(t.classList.toggle(a),t.classList.toggle(o)))},u=(()=>{let e=[],t=0,a={priority:{high:[],medium:[],low:[]},project:{}};const r=t=>{const a=s(t);p({old:e[a]}),m(),e.splice(a,1)},s=t=>e.findIndex((e=>e.uid==t)),l=t=>{let a;0==e.length?e.push(t):t.dueDate&&e[0].dueDate>t.dueDate?e.unshift(t):(a=c(t),-1==a?e.push(t):e.splice(a,0,t))},c=t=>e.findIndex((e=>{let a=e.dueDate?n(e.dueDate):1/0,o=t.dueDate?n(t.dueDate):1/0;return a==o?d(e.priority)<=d(t.priority):a>o})),d=e=>{switch(e&&(e=e.toLowerCase()),e){case"high":return 3;case"medium":return 2;case"low":return 1;default:return 0}},u=(e,t,a)=>{const r=a[e];if("allValues"===r)return!0;if("dueDate"===e)return!(t[e]||r.lowerBound||r.upperBound)||!!t[e]&&("lowerBound"in r&&r.lowerBound?"upperBound"in r&&r.upperBound?t[e]>=r.lowerBound&&t[e]<=r.upperBound:t[e]>=r.lowerBound:t[e]<=r.upperBound);if("text"===e){const e=o(t.dueDate,{weekday:"long",year:"numeric",month:"long",day:"numeric"});return`${t.title} ${t.notes} ${e} ${t.priority} priority ${t.project} project`.toLowerCase().includes(r.toLowerCase())}return r&&t[e]?t[e].toString().toLowerCase()===r.toString().toLowerCase():r==t[e]},p=e=>{for(let t in a){if(e.old&&t in e.old&&e.old[t]){let o=e.old[t],{[t]:{[o]:r}}=a;const s=r.indexOf(e.old.uid);r.splice(s,1)}if(e.new&&t in e.new&&e.new[t]){let o=e.new[t],{[t]:{[o]:r}}=a;e.new[t]in a[t]?r.push(e.new.uid):a[t][o]=[e.new.uid]}}},m=()=>{const e=["priority"];for(let t in a)if(!e.includes(t))for(let e in a[t])0==a[t][e].length&&delete a[t][e]};return{addTask:e=>{const a=(({title:e="",project:a="",dueDate:o="",priority:r="",notes:s=""})=>({uid:t++,title:e,project:a,dueDate:i(o),priority:r,notes:s,isCompleted:!1}))(e);return l(a),p({new:{...a}}),a},deleteTask:r,modifyTask:t=>{const a=s(t.uid);let o={...e[a]};r(t.uid),!("dueDate"in t)||t.dueDate instanceof Date||(t.dueDate=i(t.dueDate));for(let e in t)"uid"!==e&&(o[e]=t[e]);return l(o),p({new:o}),m(),t},getAll:()=>e,getSearch:t=>{let a=[...e];for(let e in t)a=a.filter((a=>u(e,a,t)));return a},getTagIndex:()=>a}})();u.addTask({title:"task 0",notes:"some notes 1",project:"",dueDate:r(),priority:"high"});for(let e=0;e<10;e++)u.addTask({title:"title 1",notes:"some notes 1",project:"",dueDate:r(),priority:"high"}),u.addTask({title:"title 2",notes:"",project:"shopping",dueDate:r(),priority:""}),u.addTask({title:"title 3",notes:"some notes 3",project:"sports",dueDate:"",priority:"low"}),u.addTask({title:"title 3",notes:"some notes 3",project:"sports",dueDate:"",priority:"medium"});const p=(a,o,r="collapse")=>{const s=e(!1,"form",{classList:o,id:a});d(r,s);const i=e(s,"h3",{classList:`${o}__header`}),n=e(s,"textarea",{classList:`${o}__title`,required:!0,ariaLabel:"Title Input",name:"title"}),l=e(s,"textarea",{classList:`${o}__project`,ariaLabel:"Project Input",name:"project"}),c=e(s,"div",{classList:`${o}__due-date-container`}),u=e(c,"label",{htmlFor:`${a}-due-date-input`,textContent:"Due Date"}),p=e(c,"input",{classList:`${o}__due-date`,type:"date",id:`${a}-due-date-input`,name:"dueDate"}),m=e(s,"div",{classList:`${o}__priority-container`}),f=(e(m,"label",{htmlFor:`${a}-priority-input`,textContent:"Priority"}),t(m,{id:`${a}-priority-input`,name:"priority"},[{value:"",textContent:""},{value:"high",textContent:"High"},{value:"medium",textContent:"Medium"},{value:"low",textContent:"Low"}])),y=e(s,"textarea",{classList:`${o}__notes`,ariaLabel:"Additional Notes Input",name:"notes"}),h=e(s,"div",{classList:`${o}__controls-container`}),L=e(h,"button",{type:"submit",textContent:"Save"});return e(h,"button",{type:"reset",textContent:"Reset"}),{form:s,formHeader:i,titleTextArea:n,projectTextArea:l,dueDateLabel:u,dueDateInput:p,prioritySelect:f,notesTextArea:y,submitButton:L,closeButton:e(h,"button",{type:"button",textContent:"Close"})}},m=t=>{const a=e(t,"div",{classList:"card"}),r=e(a,"button",{classList:"card__check",ariaLabel:"Toggle Completed"}),s=e(r,"i"),i=e(a,"h3",{classList:"card__title"}),n=e(a,"div",{classList:"card__control-container"}),p=e(n,"button",{classList:"card__delete-button",type:"button",ariaLabel:"Delete Task"}),m=(e(p,"i",{classList:"fas fa-times"}),e(n,"button",{classList:"card__modify-button",type:"button",ariaLabel:"Modify Task"})),f=(e(m,"i",{classList:"fas fa-pencil-alt"}),e(a,"div",{classList:"card__tag-container"})),y=e(f,"span",{classList:"card__tag card__due-date"}),h=e(f,"span",{classList:"card__tag card__priority"}),L=e(f,"span",{classList:"card__tag card__project"}),x=e(a,"p",{classList:"card__notes"});a.addEventListener("click",(()=>{d("toggle",x)})),r.addEventListener("click",(e=>{e.stopPropagation(),D(s,a.getAttribute("data-unique-id"))})),p.addEventListener("click",(e=>{e.preventDefault(),e.stopPropagation(),a.remove(),u.deleteTask(a.getAttribute("data-unique-id"))})),m.addEventListener("click",(e=>{e.preventDefault(),e.stopPropagation(),((e,t)=>{const a=document.querySelector("#modify-task-form"),r=u.getSearch({uid:e})[0],s=a.querySelector(".sticky-form__header"),i=a.querySelector(".sticky-form__title"),n=a.querySelector(".sticky-form__project"),c=a.querySelector(".sticky-form__due-date"),p={high:a.querySelector("#modify-task-form-priority-input option[value=high]"),medium:a.querySelector("#modify-task-form-priority-input option[value=medium]"),low:a.querySelector("#modify-task-form-priority-input option[value=low]"),none:a.querySelector('#modify-task-form-priority-input option[value=""]'),selected:a.querySelector("#modify-task-form-priority-input option[selected]")},m=a.querySelector(".sticky-form__notes");s.textContent="Modify Task",i.defaultValue=r.title,i.value=r.title,n.value=r.project,n.defaultValue=r.project;const f=o(r.dueDate,{},"sv");c.value=f,c.defaultValue=f,p.selected&&(p.selected.defaultSelected=!1),p[r.priority||"none"].defaultSelected=!0,m.value=r.notes,m.defaultValue=r.notes,a.onsubmit=a=>((e,t,a)=>{e.preventDefault();const o=e.target.elements,r=u.modifyTask({uid:t,title:o.title.value,project:o.project.value,dueDate:o.dueDate.value,priority:o.priority.value,notes:o.notes.value});if(d("collapse","#modify-task-form"),r&&l())a(r,{display:"expand"}),setTimeout(d,250,"expand","#search-form");else if(r){w();const e=document.getElementById(r.uid);e.parentNode.classList.contains("collapsed-height")&&d("expand",e.parentNode),d("expand",e.querySelector(".card__notes")),e.scrollIntoView(!0)}})(a,e,t)})(a.getAttribute("data-unique-id"),T),c("#modify-task-form.expanded-height")||(d("collapse",".sticky-form.expanded-height"),setTimeout(d,100,"expand","#modify-task-form"))}));const T=(e,t={})=>{a.id=e.uid,"display"in t&&d(t.display,x),a.setAttribute("data-unique-id",e.uid),_(s,e.isCompleted),i.textContent=e.title,v(y,e.dueDate),k(h,e.priority),g(L,e.project),x.textContent=e.notes||"No notes"};return{populateCard:T}},f=["far","fa-check-square","checked"],y=["far","fa-square"],h=["card__list-item--checked"],L=["card__list-item--unchecked"],_=(e,t)=>{t?(x(e,y,f),x(e.parentElement,L,h)):(x(e,f,y),x(e.parentElement,h,L))},D=(e,t)=>{const a=e.classList.contains("checked");_(e,!a),u.modifyTask({uid:t,isCompleted:!a})},k=(e,t)=>{var a;t?(e.classList.remove("display-none"),x(e,["card__priority--low","card__priority--medium","card__priority--high"],[`card__priority--${t}`]),e.textContent=(a=t).charAt(0).toUpperCase()+a.slice(1)):e.classList.add("display-none")},v=(e,t)=>{t?(e.classList.remove("display-none"),e.textContent=o(t,{weekday:"short",year:"numeric",month:"short",day:"numeric"})):e.classList.add("display-none")},g=(e,t)=>{t?(e.classList.remove("display-none"),e.textContent=t):e.classList.add("display-none")},x=(e,t=[],a=[])=>{e.classList.remove(...t),e.classList.add(...a)},w=()=>{const t=document.querySelector("body");let r;c("main")?(r=document.querySelector("main"),r.innerHTML=""):r=e(t,"main");const i=(()=>{const e=new Date,t=new Date;t.setHours(23,59,59,999);const o=a(5);o.setHours(23,59,59,999);const r=a(0);r.setHours(23,59,59,999);const s=(new Date).setDate(t.getDate()+7),i=(e=>{const t=e.getFullYear(),a=e.getMonth();return new Date(t,a+1,0)})(new Date(s));return i.setHours(23,59,59,999),{now:e.toJSON(),endOfDay:t.toJSON(),workweek:o.toJSON(),weekend:r.toJSON(),monthEnd:i.toJSON()}})(),n=T(r,{title:"Overdue",classList:"overdue",criteria:s(!1,i.now)}),l=e(n.header,"i",{classList:"fas fa-chevron-circle-down"});d("collapse",n.cardContainer),n.header.addEventListener("click",(()=>{d("toggle",n.cardContainer),l.classList.toggle("rotate-180")}));const u=T(r,{title:"No Due Date",classList:"no-date",criteria:s("","")}),p=e(u.header,"i",{classList:"fas fa-chevron-circle-down"});d("collapse",u.cardContainer),u.header.addEventListener("click",(()=>{d("toggle",u.cardContainer),p.classList.toggle("rotate-180")})),T(r,{title:"Today",classList:"today",criteria:s(i.now,i.endOfDay)});const m=S(i.endOfDay,i.workweek,i.weekend);i.endOfDay!==m.earlierDays.dueDate.upperBound&&T(r,{title:m.earlierTitle,classList:"early-week",criteria:m.earlierDays}),T(r,{title:m.laterTitle,classList:"late-week",criteria:m.laterDays});const f=o(i.monthEnd,{month:"long"});T(r,{title:`${f}`,classList:"month",criteria:s(m.laterDays.dueDate.upperBound,i.monthEnd)}),T(r,{title:`After ${f}`,classList:"others",criteria:s(i.monthEnd)})},T=(t,a)=>{const o=u.getSearch(a.criteria),r=e(t,"section",{classList:`home-section ${a.classList}`}),s=e(r,"div",{classList:`home-section__header ${a.classList}__header`}),i=e(s,"h3",{classList:`home-section__title ${a.classList}__title`,textContent:a.title});C(s,o).classList.add(`${a.classList}__priority-counter`);const n=e(r,"div",{classList:`home-section__card-container ${a.classList}__card-container`});return 0==o.length?e(n,"p",{textContent:"No tasks"}):b(n,o,{display:"collapse"}),{container:r,header:s,title:i,cardContainer:n}},b=(e,t,a)=>{t.forEach((t=>{m(e).populateCard(t,a)}))},S=(e,t,a)=>{let o,r,i,n;return t<a?(i="This Week",n="Weekend",o=t,r=a):(i="Sunday",n="Next Monday to Friday",o=a,r=t),{earlierDays:s(e,o),laterDays:s(o,r),earlierTitle:i,laterTitle:n}},C=(t,a)=>{let o={high:0,medium:0,low:0,none:0};a.forEach((e=>{o[e.priority||"none"]++}));const r=e(t,"div",{classList:"priority-counter"});for(let t in o){if(!o[t])continue;const a=e(r,"div",{classList:`priority-counter__light priority-counter__light--${t}`});e(a,"span",{textContent:o[t]})}return r};w(),(()=>{const t=document.querySelector("body"),a=e(t,"div",{classList:"sticky-container"}),o=e(a,"div",{classList:"controls"}),r=e(o,"div",{classList:"controls__button fa-stack"}),s=(e(r,"i",{classList:"fas fa-circle fa-stack-2x"}),e(r,"i",{classList:"fas fa-bars fa-stack-1x fa-inverse"}),e(o,"div",{classList:"controls__extension"})),i=e(s,"div",{classList:"controls__button fa-stack"}),n=(e(i,"i",{classList:"fas fa-circle fa-stack-2x"}),e(i,"i",{classList:"fas fa-search fa-stack-1x fa-inverse"}),e(s,"div",{classList:"controls__button",id:"new-task-button"}));e(n,"i",{classList:"fas fa-plus-circle fa-2x"}),n.addEventListener("click",(()=>{c("#new-task-form.expanded-height")||(c(".sticky-form.expanded-height")?(d("collapse",".sticky-form.expanded-height"),setTimeout(d,100,"expand","#new-task-form")):d("expand","#new-task-form"))})),i.addEventListener("click",(()=>{c("#search-form.expanded-height")||(c(".sticky-form.expanded-height")?(d("collapse",".sticky-form.expanded-height"),setTimeout(d,100,"expand","#search-form")):d("expand","#search-form"))}))})(),(()=>{const e=p("new-task-form","sticky-form");e.formHeader.textContent="New Task",e.titleTextArea.placeholder="Title",e.projectTextArea.placeholder="Project",e.notesTextArea.placeholder="Notes",e.form.addEventListener("submit",(e=>{e.preventDefault();const t=e.target.elements,a=u.addTask({title:t.title.value,project:t.project.value,dueDate:t.dueDate.value,priority:t.priority.value,notes:t.notes.value});if(a){t.title.value="",t.notes.value="",w();const e=document.getElementById(a.uid);e.parentNode.classList.contains("collapsed-height")&&d("expand",e.parentNode),d("expand",e.querySelector(".card__notes")),e.scrollIntoView(!0)}})),e.closeButton.addEventListener("click",(()=>{l()&&(d("collapse","#new-task-form"),setTimeout(d,100,"expand","#search-form")),d("collapse","#new-task-form")})),document.querySelector(".sticky-container").appendChild(e.form)})(),(()=>{const e=p("modify-task-form","sticky-form");e.closeButton.addEventListener("click",(()=>{l()&&(d("collapse","#modify-task-form"),setTimeout(d,100,"expand","#search-form")),d("collapse","#modify-task-form")})),document.querySelector(".sticky-container").appendChild(e.form)})(),(()=>{const a=p("search-form","sticky-form"),o=e(!1,"div",{classList:"sticky-form__due-date-container"}),r=(e(o,"label",{htmlFor:"search-form-due-date-input-to",textContent:"To",ariaLabel:"Due Date to:"}),e(o,"input",{classList:"sticky-form__due-date",type:"date",id:"search-form-due-date-input-to",name:"dueDateTo"}));r.addEventListener("input",(()=>{a.dueDateInput.value>r.value&&r.setCustomValidity("End Date cannot be earlier than Start Date")})),a.form.insertBefore(o,a.dueDateInput.parentNode.nextSibling);const s=e(!1,"div",{classList:"sticky-form__project-container"}),n=(e(s,"label",{htmlFor:"search-form-project",textContent:"Project"}),Object.keys(u.getTagIndex().project).map((e=>({value:e,text:e}))));n.unshift({value:"allValues",text:"All"}),n.push({value:"",text:"None"}),t(s,{classList:"sticky-form__project-select",name:"project",id:"search-form-project"},n),a.form.insertBefore(s,a.dueDateInput.parentNode),a.prioritySelect[""].value="allValues",a.prioritySelect[""].textContent="All";const c=e(!1,"option",{value:"",textContent:"None"});a.prioritySelect.selectElement.insertBefore(c,a.prioritySelect.low.nextSibling),a.formHeader.textContent="Search",a.titleTextArea.name="text",a.titleTextArea.placeholder="Search title and notes...",a.titleTextArea.ariaLabel="Search for title and notes",a.titleTextArea.required=!1,a.projectTextArea.remove(),a.dueDateLabel.textContent="From",a.dueDateLabel.htmlFor="search-form-due-date-input-from",a.dueDateInput.id="search-form-due-date-input-from",a.dueDateInput.name="dueDateFrom",a.notesTextArea.remove(),a.submitButton.textContent="Search",a.form.addEventListener("submit",(t=>{t.preventDefault(),window.scrollTo(0,0);const a=t.target.elements,o={text:a.text.value||"allValues",project:a.project.value,dueDate:{lowerBound:i(a.dueDateFrom.value),upperBound:i(a.dueDateTo.value)},priority:a.priority.value};a.dueDateFrom.value||a.dueDateTo.value||(o.dueDate="allValues");(t=>{const a=document.querySelector("main");a.innerHTML="",e(a,"h3",{classList:"search-results_header",textContent:"Search Results"}),b(a,t,{display:"expand"})})(u.getSearch(o))})),a.closeButton.addEventListener("click",(()=>{l()?(d("collapse",a.form),w(),window.scrollTo(0,0)):d("collapse",a.form)})),document.querySelector(".sticky-container").appendChild(a.form)})(),(()=>{const t=document.querySelector("body"),a=e(t,"footer",{classList:"footer"}),o=e(a,"a",{classList:"footer__icon",href:"https://www.github.com/tzunwip/to-do-list",target:"_blank"});e(o,"i",{classList:"fab fa-github fa-2x"})})()})();