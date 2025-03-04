// Code: 213
async function get_subdomains(){
    domain = document.getElementById("domain").value
    console.log(domain)
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
    let stop = start_spinner() 
    set_info("Fetching TECH STACK")
    let checkboxes = document.querySelectorAll(`input[type="checkbox"]`)
    let req_subdomains = []
    console.log(checkboxes, checkboxes.length)
    for(let i=0;i<checkboxes.length;i++){
        if(checkboxes[i].checked){
            req_subdomains.push(checkboxes[i].value)
        }
    }
    console.log(req_subdomains)

    const response = await fetch(`http://${host_ip}/tech_stack/`,{
        method: 'POST', // Specify the HTTP method
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(req_subdomains)
    })

    const fetched_data = await response.json()
    set_tech_stack(fetched_data['tech_stack'])
    set_info("TECH STACK FETCHED SUCCESSFULLY")
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
    let stop = start_spinner() 
    set_info("Crawling Selected Subdomains")
    let checkboxes = document.querySelectorAll(`input[type="checkbox"]`)
    let req_subdomains = []
    console.log(checkboxes, checkboxes.length)
    for(let i=0;i<checkboxes.length;i++){
        if(checkboxes[i].checked){
            req_subdomains.push(checkboxes[i].value)
        }
    }
    console.log(req_subdomains)

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