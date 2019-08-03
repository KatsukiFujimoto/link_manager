$(document).ready(function() {
  const storageKey = "linkObj";
  let linkAry = [];

  let saveStorage = function(key,val) {
    localStorage.setItem(key, JSON.stringify(val));
  };

  let getStorage = function(key) {
    let val = localStorage.getItem(key);
    if (val == undefined) return null;
    return JSON.parse(val);
  };

  let create = function() {
    let linkUrl = $("#urlInput").val();
    let linkName = $("#nameInput").val();
    let linkTab = $("#tabInput").val();
    addLink(linkUrl, linkName, linkTab);
    let linkId = getIndex(linkAry, "linkUrl", linkUrl);
    addList(linkUrl, linkName, linkTab, linkId);
    initializeForm();
  };

  let update = function(linkId) {
    let linkUrl = $("#urlInput").val();
    let linkName = $("#nameInput").val();
    let linkTab = $("#tabInput").val();
    updateLink(linkUrl, linkName, linkTab, linkId);
    updateList(linkUrl, linkName, linkTab, linkId);
    initializeForm();
  };

  let destroy = function(link) {
    let linkId = link.data('id');
    deleteLink(linkId);
    deleteList(linkId);
    initializeForm();
  };

  let addList = function(linkUrl, linkName, linkTab, linkId) {
    let linkView = `<li class="link-list" id="linkList-${linkId}" data-id="${linkId}">
                      <a class="linkUrl" href="${linkUrl}" target="_blank">
                        <img class="linkFavicon" src="${faviconUrl(linkUrl)}">
                        <span class="linkName">${linkName}</span>
                        <span class="linkTab">${linkTab}</span>
                      </a>
                      <div class="actions">
                        <a class="move nonFavorite nonFavorite-${linkId}" data-id="${linkId}"><i class="far fa-star fa-lg" data-id="${linkId}"></i></a>
                        <a class="move favorite favorite-${linkId}" data-id="${linkId}"><i class="fas fa-star fa-lg" data-id="${linkId}"></i></a>
                        <a class="move updateForm" data-id="${linkId}"><i class="far fa-edit fa-lg" data-id="${linkId}"></i></a>
                        <a class="move delete" data-id="${linkId}"><i class="far fa-trash-alt fa-lg" data-id="${linkId}"></i></a>
                      </div>
                    </li>`;
    $("#linkLists").append(linkView);
  };

  let updateList = function(linkUrl, linkName, linkTab, linkId) {
    let linkList = $(`linkList-${linkId}`);
    linkList.find(".linkUrl").html(linkUrl);
    linkList.find(".linkFavicon").attr("src", linkUrl);
    linkList.find(".linkName").html(linkName);
    linkList.find(".linkTab").html(linkTab);
  };

  let deleteList = function(linkId) {
    $(`#linkList-${linkId}`).remove();
  };

  let addLink = function(linkUrl, linkName, linkTab) {
    let linkObj = {
      linkUrl: linkUrl,
      linkName: linkName,
      linkTab: linkTab,
      favorite: false
    };
    linkAry.push(linkObj);
    saveStorage(storageKey, linkAry);
  };

  let updateLink = function(linkUrl, linkName, linkTab, linkId) {
    let linkObj = linkAry[linkId];
    linkObj.linkUrl = linkUrl;
    linkObj.linkName = linkName;
    linkObj.linkTab = linkTab;
    saveStorage(storageKey, linkAry);
  };

  let deleteLink = function(linkId) {
    delete linkAry[linkId];
    saveStorage(storageKey, linkAry);
  };

  let readLink = function() {
    linkAry = [];
    let linkObjs = getStorage(storageKey);
    if (linkObjs === null) return;
    for (let i = 0; i < linkObjs.length; i++) {
      let linkObj = linkObjs[i];
      linkAry.push(linkObj);
      if (linkObj === null) continue;
      addList(linkObj.linkUrl, linkObj.linkName, linkObj.linkTab, i);
      if (linkObj.favorite === true) { toggleFavorites(i) };
    }
  };

  let createFarovite = function(linkId) {
    let linkObj = linkAry[linkId];
    if (linkObj.favorite === true) return;
    linkObj.favorite = true;
    saveStorage(storageKey, linkAry);
    toggleFavorites(linkId);
  };

  let deleteFavorite = function(linkId) {
    let linkObj = linkAry[linkId];
    if (linkObj.favorite === false) return;
    linkObj.favorite = false;
    saveStorage(storageKey, linkAry);
    toggleFavorites(linkId);
  };

  let toggleFavorites = function(linkId) {
    $(`.nonFavorite.nonFavorite-${linkId}`).toggle();
    $(`.favorite.favorite-${linkId}`).toggle();
  };

  let helpers = (function() {
    let squish = function(str = "") {
      return str.replace(/ +(?= )/g,'').trim();
    };

    return {
      squish: squish,
    }
  })();

  let filterWithKwd = function() {
    let linkLists = $("#linkLists").find(".link-list");
    let searchKwd = helpers.squish($("#searchKwd").val().toLowerCase());

    if ($(".nonFavorite").css('display') === 'none') {
      linkLists = $("#linkLists").find(".link-list").filter(function() {
        return $(this).find(".nonFavorite").css('display') === 'none';
      });
    };

    linkLists.each(function() {
      let linkList = $(this);
      let linkName = helpers.squish(linkList.find(".linkName").html().toLowerCase());
      let linkTab = helpers.squish(linkList.find(".linkTab").html().toLowerCase());
      let matched = (linkName.indexOf(searchKwd)) > -1 || (linkTab).indexOf(searchKwd) > -1;
      linkList.toggle(matched);
    });
  };

  let filterToFavorites = function() {
    let linkLists = $("#linkLists").find(".link-list");
    linkLists.each(function() {
      let isFavorite = $(this).find(".nonFavorite").css('display') === 'none';
      $(this).toggle(isFavorite);
    });
  };

  let removeFilter = function() {
    let linkLists = $("#linkLists").find(".link-list");
    linkLists.each(function() {
      $(this).show();
    });
  }

  let getIndex = function(ary, prop, value) {
    for (let i = 0; i < ary.length; i++) {
      if (isEmpty(ary[i])) continue;
      if (ary[i][prop] === value) {
        return i;
      }
    }
    return -1; // 値が存在しない場合
  };

  let faviconUrl = function(url) {
    if (isEmpty(url)) return "";
    return "http://www.google.com/s2/favicons?domain=" + getDomain(url)
  }

  let getDomain = function(url) {
    return url.match(/:\/\/(.[^/]+)/)[1];
  }

  let resetForm = function() {
    $("#linkSaveForm").find("#urlInput, #nameInput, #tabInput, #idInput").val("");
  };

  let initializeForm = function() {
    resetForm();
    $("linkSaveForm").hide();
  }

  let isFormShown = function() {
    return !($("#linkSaveForm").css('display') === 'none');
  };

  let isFormType = function(type) {
    return $("#submitBtn").val() === type;
  };

  let sameLinkClick = function(clickedId) {
    if (!(isFormShown() && isFormType("更新"))) return false;
    let shownId = $("#idInput").val();
    return shownId == clickedId;
  };

  let fillFormWith = function(linkObj, linkId) {
    $("#urlInput").val(linkObj.linkUrl);
    $("#nameInput").val(linkObj.linkName);
    $("#tabInput").val(linkObj.linkTab);
    $("#idInput").val(linkId);
    $("#submitBtn").val('更新');
  };

  let csvExport = function() {
    let headers = {
      favorite: 'favorite',
      linkUrl: 'linkUrl',
      linkName: 'linkName',
      linkTab: 'linkTab'
    };
    let fileTitle = 'linkManager';
    let linkObjs = getStorage(storageKey);
    let linkObjsFormatted = [];

    linkObjs.forEach((linkObj) => {
      linkObjsFormatted.push({  // remove commas to avoid errors
        favorite: linkObj !== null ? linkObj.favorite : '',
        linkUrl: linkObj !== null ? linkObj.linkUrl.replace(/,/g, '') : '',
        linkName: linkObj !== null ? linkObj.linkName.replace(/,/g, '') : '',
        linkTab: linkObj !== null ? linkObj.linkTab.replace(/,/g, '') : ''
      })
    });

    exportCSVFile(headers, linkObjsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
  };

  let csvUpload = function(event) {
    $.when(
      resetData(),
      upload(event)
    ).done(function() {
      readLink(),
      $("#csvUpload").val(null),
      $("#csvBox").toggle()
    });
  }

  let isEmpty = function(obj) {
    return obj == "" || obj == undefined || obj == null;
  }

  // ショートカットキー用
  let showFavorites = function() {
    let linkId = "null";
    let isFavorite = $(".nonFavorite-null").css('display') === 'none';
    if (isFavorite) {
      toggleFavorites(linkId);
      removeFilter();
    } else {
      toggleFavorites(linkId);
      filterToFavorites();
    }
  };

  let focusSearchBar = function() {
    $("#searchKwd").focus();
  };

  let createLinkForm = function() {
    if (isFormShown() && isFormType("更新")) {
      resetForm();
      $("#submitBtn").val('作成');
      $("#urlInput").focus();
    } else if (isFormShown() && isFormType("作成")) {
      $("#linkSaveForm").toggle();
    } else {
      resetForm();
      $("#submitBtn").val('作成');
      $("#linkSaveForm").toggle();
      $("#urlInput").focus();
    }
  };

  let resetData = function() {
    localStorage.removeItem(storageKey);
    $("#linkLists").children().remove();
    linkAry = [];
  }

  // ページ読み込み時のリンク復元
  // resetData();
  readLink();

  // イベントハンドル
  $("#createForm").on('click', function() {
    if (isFormShown() && isFormType("更新")) {
      resetForm();
      $("#submitBtn").val('作成');
      $("#urlInput").focus();
    } else if (isFormShown() && isFormType("作成")) {
      $("#linkSaveForm").toggle();
    } else {
      resetForm();
      $("#submitBtn").val('作成');
      $("#linkSaveForm").toggle();
      $("#urlInput").focus();
    }
  });

  $(".updateForm").on('click', function() {
    let linkId = $(this).data('id');
    let linkObj = linkAry[linkId];

    if (sameLinkClick(linkId)) {
      $("#linkSaveForm").toggle();
    } else if (isFormShown()) {
      fillFormWith(linkObj, linkId);
      $("#urlInput").focus();
    } else {
      fillFormWith(linkObj, linkId);
      $("#linkSaveForm").toggle();
      $("#urlInput").focus();
    }
  });

  $("#submitBtn").on('click', function() {
    let submitBtn = $(this);

    if (submitBtn.val() === "作成") {
      create();
      return;
    }
    if (submitBtn.val() === "更新") {
      let linkId = $("#idInput").val();
      update(linkId);
    }
  });

  $(".delete").on('click', function() {
    let link = $(this);
    destroy(link);
  });

  $("#searchKwd").on("keyup change", function() {
    filterWithKwd();
  });

  $("header").find(".nonFavorite").on('click', function() {
    let linkId = $(this).data('id');
    toggleFavorites(linkId);
    filterToFavorites();
  });

  $("header").find(".favorite").on('click', function() {
    let linkId = $(this).data('id');
    toggleFavorites(linkId);
    removeFilter();
  });

  $("#linkLists").on('click', ".nonFavorite", function() {
    let linkId = $(event.target).data('id');
    createFarovite(linkId);
  });

  $("#linkLists").on('click', ".favorite", function() {
    let linkId = $(event.target).data('id');
    deleteFavorite(linkId);
  });

  $("#csvBtn").on('click', function() {
    $("#csvBox").toggle();
  });

  $("#csvExport").on('click', function() {
    csvExport();
  });

  $("#csvUpload").on('change', function(event) {
    csvUpload(event);
  })

  $("#resetData").on('click', function() {
    resetData();
  });

  $(document).keydown(
    function(e) {
      const upKey = 38,
            downKey = 40;

      if ((e.ctrlKey || e.cmdKey) && e.keyCode == upKey) {
        $("#searchKwd").focus();
      } else if (e.keyCode == downKey) {
        let currentElm = $(".linkUrl:focus").parent();
        let lastElm = currentElm.siblings(":last");
        let nextVisibleElm;
        let nextElm = currentElm.next();

        while(!nextVisibleElm && (nextElm !== lastElm)) {
          if (nextElm.css('display') !== 'none') {
            nextVisibleElm = nextElm;
          }
          nextElm = nextElm.next();
        }
        if (nextVisibleElm) {
          nextVisibleElm.find(".linkUrl").focus();
        }
      } else if (e.keyCode == upKey) {
        let currentElm = $(".linkUrl:focus").parent();
        let firstElm = currentElm.siblings(":first");
        let prevVisibleElm;
        let prevElm = currentElm.prev();

        while(!prevVisibleElm && (firstElm !== prevElm)) {
          if (prevElm.css('display') !== 'none') {
            prevVisibleElm = prevElm;
          }
          prevElm = prevElm.prev();
        }
        if (prevVisibleElm) {
          prevVisibleElm.find(".linkUrl").focus();
        }
      }
    }
  );

  chrome.commands.onCommand.addListener(function(command) {
    if (command === "show_favorites") {
      showFavorites();
    } else if (command === "focus_search_bar") {
      focusSearchBar();
    } else if (command === "create_link_form") {
      createLinkForm();
    }
  });

});