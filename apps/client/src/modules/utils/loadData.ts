export const showData = () => {
    const skeletonWrapper = document.querySelectorAll(`[class="skeleton-container"]`);
    const skeletonElement = document.querySelectorAll(`[xa-element="skeletonContainer"]`);
    const dynamicDataWrap = document.querySelectorAll(`[xa-element="dynamicData"]`);

    return {
        show: () => {
            if (skeletonElement && dynamicDataWrap) {
                skeletonElement.forEach(element => {
                    element.classList.add("hide");
                });
                dynamicDataWrap.forEach(element => {
                    element.classList.remove("hide");
                })
            }

            if (skeletonWrapper) {
                skeletonWrapper.forEach(element => {
                    element.classList.add("hide");
                });
            }
        },

        showLoader: () => {
            if (skeletonElement && dynamicDataWrap) {
                skeletonElement.forEach(element => {
                    element.classList.remove("hide");
                });
                dynamicDataWrap.forEach(element => {
                    element.classList.add("hide");
                })
            }

            if (skeletonWrapper) {
                skeletonWrapper.forEach(element => {
                    element.classList.remove("hide");
                });
            }
        }
    }

}