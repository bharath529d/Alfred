let ipv4_selected = true
let ip_address_data;
let Tabs_;
let track_current_tab; // used to track the current tab so that we can change the ip from v4 to v6 and vice versa properly.
let previous_tab = null;
let selected_tab = null; // used to change the color of the selected tab
let host_ip = "127.0.0.1:8000"
// changed 1161

window.onload = function(){   // when the page is loaded then we create tabs map for storing tabs
    Tabs_ = new Tabs()
    disable_change_ip_btn()
    set_info("513")
}

function start_spinner(){
    console.log("spinner_started")
    ip_element = document.getElementById('info_loading')
    console.log("bro!:  " + ip_element)
    ip_element.innerHTML = ""
    ip_element.classList.add("spinner-border","spinner-border-sm")
    return function(){
        console.log("spinner_stopped")
        ip_element.classList.remove("spinner-border","spinner-border-sm")
    }
}

//Validate domain name
function is_valid_domain(domain){
    domain_pattern = /^[a-zA-Z0-9\-]{1,63}\.[a-z0-9\-]{2,63}/
    return domain_pattern.test(domain.trim())
}

function set_info(info){
    document.getElementById("info_text").textContent = info
}
// fetch the data from server and add a tab after doing so
async function get_resolved_ip(){
    let domain = document.getElementById('domain').value
    if(is_valid_domain(domain)){
        set_info("FETCHING IP ")
        let stop = start_spinner() 
        try {
            const url = new URL(`http://${host_ip}/getip/`)
            url.searchParams.append("domain",domain)
            console.log(url.href)
            const response = await fetch(url)
            const fetched_data = await response.json()
            if(fetched_data.success){
                ip_address_data = fetched_data
                create_new_tab(domain,fetched_data.ipv4,fetched_data.ipv6)
                track_current_tab = domain
            }else{
                set_info(fetched_data.err_mes)
            }
    
        } catch (error) {
            console.error("Error while Fetching: " + error)
        }
        stop()
    }else{
        set_info("Domain Name is not Valid")
    }
   
}

// Functionality to change the ip versions: ipv4 to ipv6 and vice versa
function change_ip_version(change_ip_btn){
    if(ipv4_selected){
        ipv4_selected = false
        set_ip(Tabs_.get_tab(track_current_tab).ipv6)
        change_ip_btn.innerHTML = "⇋ IP<small>v4</small>"
    }else{
        ipv4_selected=true
        set_ip(Tabs_.get_tab(track_current_tab).ipv4)
        change_ip_btn.innerHTML = "⇋ IP<small>v6</small>"
    }
}

// To set the ip address of the given domain in a span element
function set_ip(ip){
    document.getElementById("resolved_ip").textContent = ip
}

// To create a new Tab
function create_new_tab(domain,ipv4,ipv6){
    let tabs_area = document.getElementById("tabs_area")
    let add_tab_button;
    if(!Tabs_.get_size()){  
        add_tab_button = document.createElement("div")
        add_tab_button.classList.add("c-rounded","p-2")
        add_tab_button.id = "add_tab_btn"
        add_tab_button.innerHTML = `<div><span class="fa fa-plus"></span></div>`
        add_tab_button.addEventListener("click",function (){
            create_new_empty_tab()
        })
        tabs_area.appendChild(add_tab_button)
    }
    Tabs_.add_tab(new Tab(domain,ipv4,ipv6))
    let new_tab = document.createElement("div")// new tab as div
    new_tab.classList.add("new_tab","rounded-pill","tab","d-flex","justify-content-between","align-items-center","pt-3","pb-3","ps-3")
    selected_tab = new_tab
    new_tab.addEventListener("click",set_tab_data)  
    let tab_name = document.createTextNode(domain)  // text inside the div as domain
    let remove_icon = document.createElement("span")  // remove tab element 
    remove_icon.addEventListener("click",delete_tab)
    remove_icon.classList.add("fas","fa-times","delete_tab","mx-3")
    new_tab.appendChild(tab_name)
    new_tab.appendChild(remove_icon)
    tabs_area.insertBefore(new_tab,tabs_area.lastChild)
    set_tab_data()
    document.getElementById("info_text").textContent = "IP SUCCESSFULLY FETCHED"
}

// To render the page according to the respective tab
function set_tab_data(event=null){
    console.log("p: " + previous_tab)
    console.log("s: " + selected_tab)
    if(previous_tab === null){
        previous_tab = selected_tab
    }
    else{
        previous_tab.classList.remove("selected-tab")
        previous_tab.classList.add("normal-tab")
        if(event === null){
            previous_tab = selected_tab 
        }else{
            selected_tab = this
            previous_tab = selected_tab
        }
    }
    selected_tab.classList.add('selected-tab') // changing the color of the selected
    console.log("Set_tab called")
    let domain_name = selected_tab.textContent // gets the domain name from the tab(div) itself
    track_current_tab = domain_name  
    document.getElementById("domain").value = domain_name
    tab_data = Tabs_.get_tab(domain_name)
    set_ip(tab_data.ipv4)
    console.log("set to ipv6 in the button")
    document.getElementById("change_ip").innerHTML = "⇋ IP<small>v6</small>"
    ipv4_selected = true
}

function delete_tab(event){
    if(Tabs_.get_size() == 1){
        document.getElementById("add_tab_btn").remove()
    }
    tab_to_be_deleted = this.parentNode // removing the div element
    console.log(this)
    if(tab_to_be_deleted === selected_tab){
        create_new_empty_tab()
    }
    Tabs_.remove_tab(this.previousSibling.nodeValue)
    tab_to_be_deleted.remove()
    console.log(Tabs_.get_tabs()) 
    event.stopPropagation()
}

function disable_change_ip_btn(disable=true){
    document.getElementById("change_ip").disabled = disable
}

function create_new_empty_tab(){
    document.getElementById("domain").value = ""
    console.log("resetting fields + new_empty_tab")
    document.getElementById("resolved_ip").textContent=""
    document.getElementById("info_text").textContent = ""
}
//Class for Tabs Feature
class Tabs{
    constructor(){
        this.tabs = new Map();
        this.size = 0
    }
    add_tab(new_tab){
        if(this.size == 0){
            disable_change_ip_btn(false)
        }
        this.size++
        this.tabs.set(new_tab.domain,new_tab)
    }
    remove_tab(domain){
        this.tabs.delete(domain)
        this.size--
        if(!this.size){
            disable_change_ip_btn()
        }
    }
    get_tabs(){
        return this.tabs
    }
    get_tab(domain){
        return this.tabs.get(domain)
    }
    get_size(){
        return this.size
    }
}

class Tab {
    constructor(domain,ipv4,ipv6) {
        this.domain = domain
        this.ipv4 = ipv4
        this.ipv6 = ipv6
    }
}

// let Tabs = []
// function create_tab(domain){
//     return function(){
//         let tab = Tab(domain)
//         Tabs.push(tab)
//         console.log(Tabs)
//     }
// }

// document.getElementById("go_btn").addEventListener("click",create_tab(document.getElementById('domain').value))
