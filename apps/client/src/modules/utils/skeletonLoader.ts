let skeletonElements = null;

export const getSkeletonLoader = () => {
    if (skeletonElements === null) {
        skeletonElements = document.querySelectorAll('[xa-element="skeletonLoader"]');
    }

    return {
        components: skeletonElements, 
        show: () => {
            skeletonElements.forEach(element => {
                let skeletonDiv = element.querySelector('.skeleton-loader');
                if (!skeletonDiv) {
                skeletonDiv = document.createElement('div');
                skeletonDiv.classList.add('skeleton-loader');
        
                element.style.position = 'relative';
                element.appendChild(skeletonDiv);
                }});
        }, 

        hide: () => {
            skeletonElements = document.querySelectorAll('[xa-element="skeletonLoader"]');
            skeletonElements.forEach(element => {
                let skeletonDiv = element.querySelector('.skeleton-loader');
                if (skeletonDiv) {
                    element.removeChild(skeletonDiv);
                }
            });
        }
    }

};