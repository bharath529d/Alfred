// Code: 213
async function get_subdomains(){
    set_description("subfinder",
        "subfinder is a subdomain discovery tool that returns valid subdomains for websites, using passive online sources.",
        "https://github.com/projectdiscovery/subfinder/blob/dev/README.md")
    domain = document.getElementById("domain").value
    if(domain == ""){
        alert("Kindly Enter the Domain!")
        return
    }
    let stop = start_spinner() 
    try{
        const url = new URL(`http://${host_ip}/getsubdomains/`)
        url.searchParams.append("domain",domain)
        set_info("FETCHING SUBDOMAINS  ")
        const response = await fetch(url)
        const fetched_data = await response.json()
        stop()
        let subdomains
        if(Array.isArray(fetched_data.subdomains)){
            subdomains = fetched_data.subdomains
            
        }else{
            subdomains = JSON.parse(fetched_data.subdomains)
        }
        console.log(subdomains)
        console.log(typeof subdomains)
        console.log(fetched_data.reachable)
        reachable = fetched_data.reachable
        set_info(fetched_data.message)
        if(subdomains){
            set_subdomain_data(subdomains,reachable)
        }else{
            set_subdomain_data(["dummy","dummy"])
        }
            
    }catch(error){
        stop()
        set_info("Storing Subdomain Failed!")
        console.log(error)
    }
}

function set_subdomain_data(subdomains, reachable){
    subdomain_area = document.getElementById('section-1')
    subdomain_area.innerHTML = ""
    for (let [index,subdomain] of subdomains.entries()){
        new_sd = document.createElement("div")
        new_a = document.createElement("a")
        new_sd.classList.add("subdomain","p-2")
        new_a.href = "https://" + subdomain
        new_a.target = "_blank"
        sd_text = document.createTextNode(subdomain)
        new_a.appendChild(sd_text)
        checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = `${index}`
        checkbox.name = "selected_subdomains"
        checkbox.value = subdomain
        checkbox.classList.add("sd-cb")
        new_sd.appendChild(checkbox)
        new_sd.appendChild(new_a)
        subdomain_area.appendChild(new_sd)
        if(reachable[index]){
            new_a.classList.add("reachable")
        }else{
            new_a.classList.add("not-reachable")
        }
    }
    // oc = document.getElementById("section-1")
    // subdomain_ele_width = oc.scrollWidth
    // console.log(subdomain_ele_width)
    // for (let child of oc.children){
    //     child.style= "white-space: nowrap;overflow:hidden;"
    // }
    // if(oc.scrollHeight > oc.clientHeight){
    //     set_info(`height oveflow sw: ${oc.scrollWidth}  cw:${oc.clientWidth}`)
    // }else if(oc.scrollWidth > oc.clientWidth){
    //     set_info(`width oveflow sw: ${oc.scrollWidth}  cw:${oc.clientWidth}`)
    // }else{
    //     set_info("no_overflow")
    // }
}

async function request_tech_stack(){
    set_description("builtwith",
        "BuiltWith helps users identify tools like analytics platforms, content management systems, hosting providers, and more.",
        "https://github.com/richardpenman/builtwith/blob/master/README.rst")
    
    let checkboxes = document.querySelectorAll(`input[type="checkbox"]`)
    let req_subdomains = []
    console.log(checkboxes, checkboxes.length)
    for(let i=0;i<checkboxes.length;i++){
        if(checkboxes[i].checked){
            req_subdomains.push(checkboxes[i].value)
        }
    }
    if(req_subdomains.length == 0){
        alert("Kindly Select Atleast one subdomain")
        return
    }
    set_info("Fetching Tech Stack")
    let stop = start_spinner() 
    const response = await fetch(`http://${host_ip}/tech_stack/`,{
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(req_subdomains)
    })

    const fetched_data = await response.json()
    set_tech_stack(fetched_data['tech_stack'])
    set_info("Tech Stack Fetched Successfully")
    stop()
}

function set_tech_stack(tech_stack){
    content = `<div class="mx-3" style="font-size: 20px;">`
    for (let subdomain_obj of tech_stack){
        for (let [subdomain,techs] of Object.entries(subdomain_obj)){
            content +=`<strong><span style="font-size: 1.5rem;color: rgb(25 135 84);" >${subdomain}</span></strong><br>`
            for (let [categroup,tech] of Object.entries(techs)){
                content += `<span style="font-weight:bold"> <span class="text-primary">${categroup}</span> => ${tech} </span><br>`
            }
            content +="<hr>"
        }
    }
    content += `</div>`
    section_2 = document.getElementById("section-2")
    section_2.innerHTML = content
}

async function request_crawling_results(){ 

    set_description("katana",
    "Katana tool is a versatile web crawler designed for quickly scanning and retrieving information from websites.",
    "https://github.com/projectdiscovery/katana/blob/main/README.md")
    let checkboxes = document.querySelectorAll(`input[type="checkbox"]`)
    let req_subdomains = []
    console.log(checkboxes, checkboxes.length)
    for(let i=0;i<checkboxes.length;i++){
        if(checkboxes[i].checked){
            req_subdomains.push(checkboxes[i].value)
        }
    }
    console.log(req_subdomains)
    if(req_subdomains.length == 0){
        alert("Kindly Select Atleast one subdomain")
        return
    }
    set_info("Crawling on Selected Sub-domains...")
    let stop = start_spinner() 
    const response = await fetch(`http://${host_ip}/crawling_results/`,{
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(req_subdomains)
    })

    const fetched_data = await response.json()
    console.log(fetched_data)
    set_crawling_results(fetched_data['crawling_results'])
    set_info("Crawling Success")
    stop()
}

function set_crawling_results(crawling_results){
   
    content = `<div class="mx-3" style="font-size: 20px;">`
    for (let subdomain_obj of crawling_results){
        for (let [subdomain,urls] of Object.entries(subdomain_obj)){
            content +=`<strong><span style="font-size: 1.5rem;color: rgb(25 135 84);" >${subdomain}</span></strong><br>`
            for (let url of urls){
                content += `<span><a href="${url}">${url}</a></span><br>`
            }
             content +="<hr>"
        }

    }
    content += `</div>`
    section_2 = document.getElementById("section-2")
    section_2.innerHTML = content
}

function set_description(tool_name, tool_description,github_link){
    const section = document.getElementById("section-3");
    let emoji = "👾"
    if(tool_name == "katana"){
        emoji = "⚔"
    }else if(tool_name == "builtwith"){
        emoji = "🏴"
    }
    section.innerHTML = `
        <div>
            <div style="color:white; font-size:16px; margin:10px 10px;"><big><span style="color:#008529; font-weight:bolder">Tool Name: </span>${tool_name}</big></div>
            <div style="color:white; font-size:14px; margin:10px 10px;"><big><span style="font-weight:bolder">Description: </span> ${tool_description}</big></div>
            <div style="color:white; font-size:14px; margin:10px 10px;"><big><span style="font-weight:bolder">to learn more...<a href="${github_link}" id="tool_link" target="_blank" title="${github_link}">${emoji}</a></div>
        </div>
    `;
}
