import { queryType, WFComponent } from "@xatom/core";
import { publicQL } from "../../graphql";
import {
  GetUserSavedItemsDocument,
  SavedItemType,
  UserAddToSaveDocument,
  UserRemoveFromSaveDocument,
} from "../../graphql/graphql";

const _savedItemStore = new Map<string, string>([]);

export const loadSavedItems = (cb: () => void) => {
  publicQL
    .query(GetUserSavedItemsDocument)
    .fetch()
    .then((data) => {
      data.getUserSavedItems.forEach((i) => {
        _savedItemStore.set(i.savedItemKey, i.id);
      });

      cb();
    })
    .catch((err) => {
      console.log("failed to load save item", err);
      alert("Something went wrong");
    });
};

export const isSavedItem = (id: string) => {
  if (_savedItemStore.has(id)) {
    return _savedItemStore.get(id) ? true : false;
  }

  return false;
};

export const getSavedData = (id: string) => {
  return _savedItemStore.get(id);
};

export const addOrUpdateToSaveItem = (
  id: string,
  status: boolean,
  saveId: string = ""
) => {
  if (status) {
    _savedItemStore.set(id, saveId);
  } else {
    _savedItemStore.delete(id);
  }
  return status;
};

export const initSaveComponent = (
  id: string,
  itemType: SavedItemType,
  queryForComponent: queryType,
  cb: (isFilled: boolean) => void = () => {}
) => {
  const heartParent = new WFComponent(queryForComponent);
  const heartSvg =
    heartParent.getChildAsComponent(".heart-icn");
  const saveToItemReq = publicQL.mutation(
    UserAddToSaveDocument
  );
  const removeFromtemReq = publicQL.mutation(
    UserRemoveFromSaveDocument
  );
  let isFilled = isSavedItem(id);

  const renderFillHeart = () => {
    if (isFilled) {
      heartSvg.addCssClass("filled");
    } else {
      heartSvg.removeCssClass("filled");
    }
  };
  const showLoadingState = (status: boolean) => {
    if (status) {
      heartParent.setAttribute("style", "opacity:0.5;");
    } else {
      heartParent.setAttribute("style", "opacity:1;");
    }
  };
  renderFillHeart();

  setInterval(() => {
    if (
      saveToItemReq.isLoading() ||
      removeFromtemReq.isLoading()
    ) {
      //do nothing
      return;
    }
    const newIsFilled = isSavedItem(id);
    if (newIsFilled !== isFilled) {
      isFilled = newIsFilled;
      renderFillHeart();
    }
  }, 2000);

  saveToItemReq.onLoadingChange((status) => {
    showLoadingState(status);
  });
  removeFromtemReq.onLoadingChange((status) => {
    showLoadingState(status);
  });

  heartParent.on("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (
      saveToItemReq.isLoading() ||
      removeFromtemReq.isLoading()
    ) {
      //do nothing
      return;
    }
    if (isFilled) {
      const isYes = confirm(
        "Are you sure wanted to remove this item?"
      );
      if (!isYes) return;

      removeFromtemReq
        .fetch({
          savedId: getSavedData(id),
        })
        .then(() => {
          isFilled = addOrUpdateToSaveItem(id, false, "");
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to un-favorite");
        })
        .finally(() => {
          renderFillHeart();
          cb(false);
        });
    } else {
      saveToItemReq
        .fetch({
          itemId: id,
          itemType,
        })
        .then((data) => {
          isFilled = addOrUpdateToSaveItem(
            id,
            true,
            data.addToSave
          );
        })
        .catch((err) => {
          console.log(err);
          alert("Failed to favorite");
        })
        .finally(() => {
          renderFillHeart();
          cb(true);
        });
    }
    isFilled = !isFilled;
    renderFillHeart();
  });

  return isFilled;
};
