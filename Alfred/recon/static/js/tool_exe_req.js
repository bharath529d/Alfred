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
        console.log(fetched_data.subdomains)
        console.log(typeof fetched_data.subdomains)
        subdomains = JSON.parse(fetched_data.subdomains)
        console.log(subdomains)
        console.log(typeof subdomains)
        set_info(fetched_data.message)
        if(subdomains){
            set_subdomain_data(subdomains)
        }else{
            set_subdomain_data(["dummy","dummy"])
        }
            
    }catch(error){
        stop()
        set_info("Storing Subdomain Failed!")
        console.log(error)
    }
}

function set_subdomain_data(subdomains){
    subdomain_area = document.getElementById('section-1')
    subdomain_area.innerHTML = ""
    for (let subdomain of subdomains){
        new_sd = document.createElement("div")
        new_a = document.createElement("a")
        new_sd.classList.add("subdomain","p-2")
        new_a.href = "https://" + subdomain
        new_a.target = "_blank"
        sd_text = document.createTextNode(subdomain)
        new_a.appendChild(sd_text)
        new_sd.appendChild(new_a)
        subdomain_area.appendChild(new_sd)
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