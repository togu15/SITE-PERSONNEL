// Include links created later by map attribution and experience cards.
function prepareLinks(root){for(const a of root.querySelectorAll('a[href]')){if(a.closest('.shared-menu')){a.removeAttribute('target');a.removeAttribute('rel');continue;}const href=a.getAttribute('href');if(!/^(mailto:|tel:|#)/i.test(href)){a.target='_blank';a.rel='noopener noreferrer';}}}
prepareLinks(document);
new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1){if(node.matches('a[href]'))prepareLinks(node.parentElement);else prepareLinks(node);}}).observe(document.body,{subtree:true,childList:true});
