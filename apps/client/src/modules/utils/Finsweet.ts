const loadCustomSelect = () => {
    const existingScript = document.querySelector('script[src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-selectcustom@1/selectcustom.js"]');
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-selectcustom@1/selectcustom.js';
        document.head.appendChild(script);
    }

    const selectToggle = document.querySelectorAll(".form-select_input-toggle");
}

export default loadCustomSelect;