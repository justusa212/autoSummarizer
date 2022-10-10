function createSummarizeButton(url){
    const element = document.createElement('div')
    element.textContent = 'Summarize'
    element.onclick = async function(e) {
        e.preventDefault()
        e.stopImmediatePropagation()
        try{
        element.textContent = 'Loading...'
        const res = await fetch('http://localhost:3000/summary', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url})
        })
        if(res.status != 200){
            throw new Error('Could not summarize')
        }
        const {summary} = await res.json()
        element.textContent = summary;
        }catch(err){
            element.textContent = 'Error summarizing '
        }
    };
    return element
}


function findAndEnrichLinks() {
    const currentHost = window.location.host
    const links = document.querySelectorAll('a')
    for(const link of [...links]){
        if(link.getAttribute('data-summary') == '1'){
            continue;
        }
        const url = new URL(link.getAttribute('href'), window.location.origin)
        if(url.origin !== 'null' && url.host !== currentHost){
            link.parentNode.append(createSummarizeButton(link.getAttribute('href')))
            link.setAttribute('data-summary','1')
        }
    }
}

findAndEnrichLinks();
 
const observer = new MutationObserver(() => findAndEnrichLinks())

observer.observe(document,{attributes: true, childList: true, subtree: true})