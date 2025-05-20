// expression-plugin-v2.jsx
// After Effects Expression Plugin v2.0 (ScriptUI Version)
// Data folder relative to script location.

var ExpressionPluginGlobalAccess = {
    // 保存全局状态的变量
    initialized: false,
    safeFolderName: null, // 安全文件夹名称函数
    // 初始化函数，将在面板加载时调用
    init: function(globalObj) {
        try {
            if (globalObj.initialized) return; // 防止重复初始化
            
            globalObj.initialized = true;
            
            if (globalObj.initializePlugin) {
                globalObj.initializePlugin();
            }
        } catch(e) {
            alert("初始化插件时出错: " + e.toString());
        }
    },
    // 提供公共的UI刷新函数，供外部调用
    refreshUI: function() {
        if (this.refreshUILayout) {
            this.refreshUILayout();
        }
    },
    // 提供其他可能需要的功能占位符
    initializePlugin: null,
    refreshUILayout: null
};

// 这个函数是ScriptUI Panel格式的入口点
function buildUI(win, isPanel) {
    //createMetadataObj();
    // 检查VERSION_NUMBER是否已定义
    var versionToUse = typeof VERSION_NUMBER !== "undefined" ? VERSION_NUMBER : "2.0.0";
    
    if (!isPanel) {
        win.text = "表达式库 v" + versionToUse;
    }
    
    // 创建一个对象来存储所有UI组件的引用
    var uiComponents = {};
    
    // 主窗口设置
    if (isPanel) {
        win.spacing = 4; // 减小spacing从5到4
        // 修改面板结构，使用列布局，子元素填充整个空间
        win.orientation = "column";
        win.alignChildren = ["fill", "fill"];
        win.alignment = ["fill", "fill"];
        win.margins = [4, 4, 4, 4]; // 减小margins从[5,5,5,5]到[4,4,4,4]
        
        // 创建顶部搜索框容器
        var topContainer = win.add("group");
        topContainer.orientation = "row";
        topContainer.alignChildren = ["fill", "center"];
        topContainer.alignment = ["fill", "top"];
        topContainer.margins = [2, 2, 2, 2]; // 减小margins从[5,5,5,5]到[2,2,2,2]
        uiComponents.topContainer = topContainer;
        
        // 搜索框移到顶部并横跨整个界面
        var searchGroup = topContainer.add("group");
        searchGroup.orientation = "row";
        searchGroup.alignChildren = ["left", "center"];
        searchGroup.alignment = ["fill", "center"];
        searchGroup.spacing = 8; // 减小spacing从10到8
        searchGroup.margins = [0, 0, 0, 0]; // 保持margins为[0,0,0,0]
        
        var searchLabel = searchGroup.add("statictext", undefined, "搜索:");
        searchLabel.preferredSize.width = 30; // 减小标签宽度 // 减半
        
        var searchEt = searchGroup.add("edittext", undefined, "");
        searchEt.helpTip = "输入关键词搜索表达式";
        searchEt.alignment = ["fill", "center"];
        searchEt.preferredSize.width = 150; // 减半
        
        // 将搜索组件添加到UI组件对象
        uiComponents.searchGroup = searchGroup;
        uiComponents.searchEt = searchEt;
        
        // 创建主内容容器，用于放置左右两个面板
        var mainGroup = win.add("group");
        mainGroup.orientation = "row";
        mainGroup.alignChildren = ["fill", "fill"];
        mainGroup.alignment = ["fill", "fill"];
        mainGroup.spacing = 8; // 减小spacing从10到8
        mainGroup.margins = [0, 0, 0, 0]; // 保持margins为[0,0,0,0]
        
        win.layout.layout(true);
        win.minimumSize = [275, 400]; // 宽度减半
    } else {
        win.orientation = "column";
        win.alignChildren = ["fill", "fill"];
        win.spacing = 4; // 减小spacing从5到4
        win.margins = 12; // 减小margins从16到12
        win.size = [275, 400]; // 宽度减半
        win.center();
        
        // 创建顶部搜索框容器
        var topContainer = win.add("group");
        topContainer.orientation = "row";
        topContainer.alignChildren = ["fill", "center"];
        topContainer.alignment = ["fill", "top"];
        topContainer.margins = [0, 2, 0, 2]; // 减小margins从[0,5,0,5]到[0,2,0,2]
        uiComponents.topContainer = topContainer;
        
        // 搜索框移到顶部并横跨整个界面
        var searchGroup = topContainer.add("group");
        searchGroup.orientation = "row";
        searchGroup.alignChildren = ["left", "center"];
        searchGroup.alignment = ["fill", "center"];
        searchGroup.spacing = 8; // 减小spacing从10到8
        searchGroup.margins = [0, 0, 0, 0]; // 保持margins为[0,0,0,0]
        
        var searchLabel = searchGroup.add("statictext", undefined, "搜索:");
        searchLabel.preferredSize.width = 30; // 减小标签宽度 // 减半
        
        // 搜索输入框
        var searchEt = searchGroup.add("edittext", undefined, "");
        searchEt.helpTip = "输入关键词搜索表达式";
        searchEt.alignment = ["fill", "center"];
        searchEt.preferredSize.width = 150; // 减半
        
        var mainGroup = win.add("group");
        mainGroup.orientation = "row";
        mainGroup.alignChildren = ["fill", "fill"];
        mainGroup.alignment = ["fill", "fill"];
        mainGroup.spacing = 8; // 减小spacing从10到8
        mainGroup.margins = [0, 0, 0, 0]; // 保持margins为[0,0,0,0]
    }
    
    // 将mainGroup添加到UI组件对象
    uiComponents.mainGroup = mainGroup;
    
    // ===== 左侧面板 =====
    var leftPanel = mainGroup.add("panel", undefined, "分类");
    leftPanel.orientation = "column";
    leftPanel.alignChildren = ["fill", "fill"];
    leftPanel.alignment = ["fill", "fill"];
    leftPanel.preferredSize.width = 100; // 减半
    leftPanel.minimumSize.width = 200; // 减半
    leftPanel.maximumSize.width = 200; // 减半
    leftPanel.margins = [0, 15, 0, 0]; // 保持边距设置不变
    
    // 将leftPanel添加到UI组件对象
    uiComponents.leftPanel = leftPanel;
    
    // 类别面板
    var categoryPanel = leftPanel.add("panel", undefined, "表达式类别");
    categoryPanel.orientation = "column";
    categoryPanel.alignChildren = ["fill", "top"];
    categoryPanel.alignment = "fill";
    categoryPanel.preferredSize.height = 150; // 恢复原始高度
    categoryPanel.margins = [10, 15, 10, 10];
    
    // 创建一个容器来放置类别列表和新建分类按钮
    var categoryContainer = categoryPanel.add("group");
    categoryContainer.orientation = "column";
    categoryContainer.alignChildren = ["fill", "fill"];
    categoryContainer.alignment = "fill";
    categoryContainer.spacing = 5;
    
    // 类别列表 - 只保留这一个实例
    var categoryList = categoryContainer.add("listbox", undefined, [], {
        multiselect: false
    });
    categoryList.alignment = "fill";
    categoryList.preferredSize.height = 75; // 减小类别列表高度
    
    // 将类别组件添加到UI组件对象
    uiComponents.categoryPanel = categoryPanel;
    uiComponents.categoryContainer = categoryContainer;
    uiComponents.categoryList = categoryList;
    
    // ===== 右侧容器 =====
    var rightContainerGroup = mainGroup.add("group");
    rightContainerGroup.orientation = "column";
    rightContainerGroup.alignChildren = ["fill", "fill"];
    rightContainerGroup.alignment = ["fill", "fill"];
    rightContainerGroup.preferredSize.width =100; // 减半
    rightContainerGroup.minimumSize.width = 100; // 减半
    rightContainerGroup.spacing = 8; // 减小spacing从10到8
    rightContainerGroup.margins = [0, 0, 0, 0]; // 保持margins为[0,0,0,0]
    uiComponents.rightContainerGroup = rightContainerGroup;
    
    // 表达式列表组
    var expressionListGroup = rightContainerGroup.add("panel", undefined, "表达式列表");
    expressionListGroup.orientation = "column";
    expressionListGroup.alignChildren = ["fill", "fill"];
    expressionListGroup.alignment = ["fill", "fill"];
    expressionListGroup.preferredSize.height = 180; // 减半
    expressionListGroup.margins = [10, 15, 10, 10];
    
    // 创建一个容器来放置表达式列表和新建表达式按钮
    var expressionContainer = expressionListGroup.add("group");
    expressionContainer.orientation = "column";
    expressionContainer.alignChildren = ["fill", "fill"];
    expressionContainer.alignment = "fill";
    expressionContainer.spacing = 5;
    
    // 表达式列表 - 只保留这一个实例
    var expressionList = expressionContainer.add("listbox", undefined, [], {
        multiselect: false
    });
    expressionList.alignment = "fill";
    expressionList.preferredSize.height =150; // 减半
    
    // 将表达式组件添加到UI组件对象
    uiComponents.expressionListGroup = expressionListGroup;
    uiComponents.expressionContainer = expressionContainer;
    uiComponents.expressionList = expressionList;
    
    // 详情面板
    var detailsPanel = rightContainerGroup.add("panel", undefined, "表达式详情");
    detailsPanel.orientation = "column";
    detailsPanel.alignChildren = ["fill", "top"];
    detailsPanel.alignment = ["fill", "fill"];
    detailsPanel.preferredSize.height = 75; // 减半
    detailsPanel.margins = [10, 15, 10, 10];
    uiComponents.detailsPanel = detailsPanel;
    
    // 名称组 - 修改使名称编辑框右对齐表达式列表
    var nameGroup = detailsPanel.add("group");
    nameGroup.orientation = "row";
    nameGroup.alignChildren = ["left", "center"];
    nameGroup.alignment = "fill";
    nameGroup.spacing = 5;
    nameGroup.margins = [0, 0, 0, 0]; // 移除所有边距
    uiComponents.nameGroup = nameGroup;
    
    var nameLabel = nameGroup.add("statictext", undefined, "名称:");
    nameLabel.preferredSize.width = 30; // 减小标签宽度
    
    var expressionNameEt = nameGroup.add("edittext");
    expressionNameEt.alignment = "fill"; // 填充剩余空间
    expressionNameEt.preferredSize.width = 150; // 减半
    expressionNameEt.helpTip = "表达式名称";
    uiComponents.expressionNameEt = expressionNameEt;
    
    // 按钮组 - 移动到表达式内容编辑框上方
    var btnGroup = detailsPanel.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignment = ["center", "top"];
    btnGroup.spacing = 8; // 减小spacing从10到8
    btnGroup.margins = [0, 10, 0, 10]; // 保持margins为[0,10,0,10]
    
    // 调整按钮顺序，将保存按钮和删除按钮位置调换
    var deleteBtn = btnGroup.add("button", undefined, "删除");
    deleteBtn.preferredSize.width = 70; // 减半
    
    var applyBtn = btnGroup.add("button", undefined, "应用");
    applyBtn.preferredSize.width = 70; // 减半
    
    var copyBtn = btnGroup.add("button", undefined, "复制");
    copyBtn.preferredSize.width = 70; // 减半
    
    var saveBtn = btnGroup.add("button", undefined, "保存");
    saveBtn.preferredSize.width = 70; // 减半
    
    uiComponents.btnGroup = btnGroup;
    uiComponents.saveBtn = saveBtn;
    uiComponents.applyBtn = applyBtn;
    uiComponents.copyBtn = copyBtn;
    uiComponents.deleteBtn = deleteBtn;
    
    // 表达式内容编辑框 - 移动到按钮组下方
    var expressionContentEt = detailsPanel.add("edittext", undefined, "", {
        multiline: true,
        scrollable: true
    });
    expressionContentEt.alignment = "fill";
    expressionContentEt.preferredSize.height = 50; // 减半
    expressionContentEt.helpTip = "表达式内容";
    uiComponents.expressionContentEt = expressionContentEt;
    
    // 传递全局访问对象和UI组件对象给主函数
    ExpressionPlugin(win, ExpressionPluginGlobalAccess, uiComponents);
    
    // 强制面板立即刷新
    if (isPanel) {
        win.layout.layout(true);
        // 使用延迟初始化确保Panel已完全加载
        try {
            var refreshTaskStr = "try { if(ExpressionPluginGlobalAccess && ExpressionPluginGlobalAccess.refreshUI) ExpressionPluginGlobalAccess.refreshUI(); } catch(e) {}";
            app.scheduleTask(refreshTaskStr, 500, false);
        } catch(e) {
            // 忽略调度错误
        }
    }
    
    return win;
}

// 确保脚本可以作为面板运行或从文件运行
if (typeof app !== "undefined" && app instanceof Application) {
    // 作为ScriptUI面板运行
    buildUI(this, true);
} else {
    // 从文件运行时，创建调色板窗口
    var win = new Window("palette", "表达式应用插件 v2.0", undefined, {resizeable: true});
    buildUI(win, false);
    win.center();
    win.show();
}

function ExpressionPlugin(thisObj, globalAccess, uiComponents) {
    var win = thisObj; // 窗口或面板对象
    var isPanel = (win instanceof Panel);
    
    // 从uiComponents对象中提取UI组件引用
    var mainGroup = uiComponents.mainGroup;
    var topContainer = uiComponents.topContainer;
    var searchGroup = uiComponents.searchGroup;
    var searchEt = uiComponents.searchEt;
    var leftPanel = uiComponents.leftPanel;
    var categoryPanel = uiComponents.categoryPanel;
    var categoryList = uiComponents.categoryList;
    var rightContainerGroup = uiComponents.rightContainerGroup;
    var expressionListGroup = uiComponents.expressionListGroup;
    var expressionList = uiComponents.expressionList;
    var detailsPanel = uiComponents.detailsPanel;
    var nameGroup = uiComponents.nameGroup;
    var expressionNameEt = uiComponents.expressionNameEt;
    var expressionContentEt = uiComponents.expressionContentEt;
    var btnGroup = uiComponents.btnGroup;
    var saveBtn = uiComponents.saveBtn;
    var applyBtn = uiComponents.applyBtn;
    var copyBtn = uiComponents.copyBtn;
    var deleteBtn = uiComponents.deleteBtn;

    // 将常用功能添加到全局访问对象
    if (globalAccess) {
        globalAccess.ExpressionPlugin = {
            // 插件主功能
            refreshUILayout: refreshUILayout,
            initializePlugin: initializePlugin,
            
            // 数据操作
            getPluginDataFolder: getPluginDataFolder,
            populateCategoryList: populateCategoryList,
            populateExpressionList: populateExpressionList,
            displayExpressionDetails: displayExpressionDetails,
            clearDetailsPanel: clearDetailsPanel,
            
            // 搜索功能
            performSearch: performSearch,
            performSearchNow: performSearchNow,
            
            // UI组件引用
            uiComponents: uiComponents
        };
    }

    var SCRIPT_NAME = "表达式应用插件 v2.0";
    var SCRIPT_VERSION = "2.0.0";
    var PLUGIN_DATA_FOLDER_NAME = "expression-plugin";
    var CATEGORY_MAP_FILENAME = "category_map.json";
    var EXPRESSION_EXT = ".txt";

    var pluginDataFolder;
    var categoryMap = {};
    var currentSelectedCategoryFolder = null;
    var currentSelectedExpressionFile = null;

    var FOLDER_ENCODING_PREFIX = "enc_";

    // --- File System Utilities ---
    function _safeFolderName(displayName) { // Renamed to avoid conflict if script is run multiple times without full AE restart
        var safeName = displayName.replace(/[^\w\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff.-]/g, '_'); // Allow dot and hyphen
        return FOLDER_ENCODING_PREFIX + safeName.toLowerCase();
    }
    // Assign to global access
    if (globalAccess) {
        globalAccess.safeFolderName = _safeFolderName;
    }


    function getPluginDataFolder() {
        if (pluginDataFolder) return pluginDataFolder;
        try {
            if (typeof $.fileName === "undefined") {
                throw new Error("无法确定脚本文件路径 ($.fileName is undefined).");
            }
            var scriptFile = new File($.fileName);
            if (!scriptFile.exists) {
                throw new Error("脚本文件路径无效: " + $.fileName);
            }
            var scriptFolder = scriptFile.parent;
            pluginDataFolder = new Folder(scriptFolder.fsName + "/" + PLUGIN_DATA_FOLDER_NAME);
            if (!pluginDataFolder.exists) {
                var created = pluginDataFolder.create();
                if (!created) {
                    alert("警告：无法在以下位置创建数据文件夹：\n" + pluginDataFolder.fsName +
                          "\n\n请检查脚本目录的写入权限，或手动创建名为 '" + PLUGIN_DATA_FOLDER_NAME + "' 的子文件夹。");
                    return null;
                }
            }
        } catch (e) {
            alert("获取插件数据文件夹时出错: " + e.toString() + "\n将尝试使用用户数据文件夹作为备用。");
            var userDataF = Folder.userData;
            pluginDataFolder = new Folder(userDataF.fsName + "/ExpressionPluginData_UserDataFallback");
            if (!pluginDataFolder.exists) {
                pluginDataFolder.create();
            }
        }
        return pluginDataFolder;
    }


    function loadCategoryMap() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) {
            alert("错误：数据文件夹不可用，无法加载分类。");
            categoryMap = {};
            return;
        }
        var mapFile = new File(baseFolder.fsName + "/" + CATEGORY_MAP_FILENAME);
        if (mapFile.exists) {
            mapFile.encoding = "UTF-8";
            mapFile.open("r");
            try {
                var content = mapFile.read();
                if (content && content.trim() !== "") {
                    categoryMap = JSON.parse(content);
                } else {
                    categoryMap = {};
                }
            } catch (e) {
                alert("错误：无法解析分类映射文件。\n" + mapFile.fsName + "\n" + e.toString() + "\n将尝试重置分类数据。");
                categoryMap = {}; // Reset if parsing fails
            }
            mapFile.close();
        } else {
            categoryMap = {};
            saveCategoryMap(); // Create an empty valid map if it doesn't exist
        }
    }

    function saveCategoryMap() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) {
            alert("错误：数据文件夹不可用，无法保存分类。");
            return;
        }
        var mapFile = new File(baseFolder.fsName + "/" + CATEGORY_MAP_FILENAME);
        mapFile.encoding = "UTF-8";
        mapFile.open("w");
        try {
            mapFile.write(JSON.stringify(categoryMap, null, 2));
        } catch (e) {
            alert("保存分类映射时发生错误: " + e.toString());
        }
        mapFile.close();
    }

    function readFileContent(file) {
        if (!file || !file.exists) return "";
        file.encoding = "UTF-8";
        file.open("r");
        var content = file.read();
        file.close();
        return content;
    }

    function writeFileContent(file, content) {
        file.encoding = "UTF-8";
        file.open("w");
        file.write(content);
        file.close();
    }

    // --- UI Logic ---
    function populateCategoryList() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;

        var previousSelection = categoryList.selection ? categoryList.selection.folderName : null;
        var wasNewCategorySelected = categoryList.selection && categoryList.selection.text === "+ 新建分类";
        categoryList.removeAll();
        var displayNames = [];
        for (var folderName in categoryMap) {
            if (categoryMap.hasOwnProperty(folderName)) {
                var catFolderCheck = new Folder(baseFolder.fsName + "/" + folderName);
                if (catFolderCheck.exists) {
                    displayNames.push(categoryMap[folderName]);
                }
            }
        }
        displayNames.sort(function(a, b) { return a.localeCompare(b, 'zh-CN'); });

        var newSelectionIndex = -1;
        for (var i = 0; i < displayNames.length; i++) {
            var item = categoryList.add("item", displayNames[i]);
            for (var fName in categoryMap) {
                if (categoryMap[fName] === displayNames[i]) {
                    item.folderName = fName;
                    if (fName === previousSelection) {
                        newSelectionIndex = i;
                    }
                    break;
                }
            }
        }

        // 添加"新建分类"选项作为最后一项
        var newCategoryItem = categoryList.add("item", "+ 新建分类");
        newCategoryItem.isNewCategory = true;

        if (wasNewCategorySelected) {
            // 如果之前选择的是"新建分类"，继续选择它
            categoryList.selection = categoryList.items.length - 1;
        } else if (newSelectionIndex !== -1) {
            categoryList.selection = newSelectionIndex;
        } else if (categoryList.items.length > 1 && !categoryList.selection) { // 不考虑"新建分类"选项
            // Let onChange handle selection if needed
        } else if (categoryList.items.length <= 1) { // 只有"新建分类"选项
            clearExpressionList();
            clearDetailsPanel(false);
        }
    }

    function populateExpressionList(categoryFolder) {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;

        var previousSelection = expressionList.selection ? expressionList.selection.fileName : null;
        var wasNewExprSelected = expressionList.selection && expressionList.selection.text === "+ 新建表达式";
        expressionList.removeAll();
        currentSelectedExpressionFile = null; // Clear this when repopulating

        if (!categoryFolder) return;

        var catFolderObj = new Folder(baseFolder.fsName + "/" + categoryFolder);
        if (!catFolderObj.exists) {
            return;
        }

        var files = catFolderObj.getFiles("*" + EXPRESSION_EXT);
        var expressionDisplayData = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i] instanceof File) {
                var filename = files[i].name;
                var displayName = "";
                try {
                    displayName = decodeURIComponent(filename.substring(0, filename.lastIndexOf(EXPRESSION_EXT)));
                } catch (e) {
                    displayName = filename.substring(0, filename.lastIndexOf(EXPRESSION_EXT));
                }
                expressionDisplayData.push({displayName: displayName, fileName: filename});
            }
        }

        expressionDisplayData.sort(function(a,b) { return a.displayName.localeCompare(b.displayName, 'zh-CN'); });

        var newSelectionIndex = -1;
        for (var j = 0; j < expressionDisplayData.length; j++) {
            var item = expressionList.add("item", expressionDisplayData[j].displayName);
            item.fileName = expressionDisplayData[j].fileName;
            if (item.fileName === previousSelection) {
                newSelectionIndex = j;
            }
        }

        // 添加"新建表达式"选项作为最后一项
        var newExpressionItem = expressionList.add("item", "+ 新建表达式");
        newExpressionItem.isNewExpression = true;

        if (wasNewExprSelected) {
            // 如果之前选择的是"新建表达式"，继续选择它
            expressionList.selection = expressionList.items.length - 1;
            handleNewExpressionCreation();
        } else if (newSelectionIndex !== -1) {
            expressionList.selection = newSelectionIndex;
        } else if (expressionList.items.length > 1 && !expressionList.selection) {
            // Let onChange handle selection
        }
        if (expressionList.selection === null && detailsPanel.text.indexOf("新建表达式 (在:") !== 0) { // MODIFIED: Don't clear if new
            clearDetailsPanel(false);
        }
    }

    function clearExpressionList() {
        expressionList.removeAll();
        currentSelectedExpressionFile = null;
    }

    function clearDetailsPanel(makeEditable) {
        expressionNameEt.text = "";
        expressionNameEt.enabled = !!makeEditable;
        
        // 处理表达式内容编辑框
        if (expressionContentEt) {
            // 处理只读状态
            var needsRecreate = (expressionContentEt.readonly && makeEditable);
            
            if (needsRecreate) {
                try {
                    // 记住原来控件的位置和大小信息
                    var oldBounds = expressionContentEt.bounds;
                    var oldAlignment = expressionContentEt.alignment;
                    var oldParent = expressionContentEt.parent;
                    var oldHeight = expressionContentEt.preferredSize.height;
                    
                    // 移除旧控件
                    expressionContentEt.parent.remove(expressionContentEt);
                    
                    // 重新创建按钮组后再创建编辑框
                    // 注意：保持正确的UI结构顺序
                    
                    // 确保按钮组仍然存在，如果被移除则重新创建
                    if (!btnGroup || !btnGroup.parent) {
                        // 按钮组已丢失，需要重建
                        btnGroup = detailsPanel.add("group");
                        btnGroup.orientation = "row";
                        btnGroup.alignment = ["center", "top"];
                        btnGroup.spacing = 8;
                        btnGroup.margins = [0, 10, 0, 10]; // 保持margins为[0,10,0,10]
                        
                        // 重新创建按钮
                        var deleteBtn = btnGroup.add("button", undefined, "删除");
                        deleteBtn.preferredSize.width = 35;
                        
                        var applyBtn = btnGroup.add("button", undefined, "应用");
                        applyBtn.preferredSize.width = 35;
                        
                        var copyBtn = btnGroup.add("button", undefined, "复制");
                        copyBtn.preferredSize.width = 35;
                        
                        var saveBtn = btnGroup.add("button", undefined, "保存");
                        saveBtn.preferredSize.width = 35;
                        
                        // 更新UI组件引用
                        uiComponents.btnGroup = btnGroup;
                        uiComponents.saveBtn = saveBtn;
                        uiComponents.applyBtn = applyBtn;
                        uiComponents.copyBtn = copyBtn;
                        uiComponents.deleteBtn = deleteBtn;
                    }
                    
                    // 创建新的编辑框（根据makeEditable设置只读状态）
                    expressionContentEt = detailsPanel.add("edittext", undefined, "", {
                        multiline: true,
                        readonly: !makeEditable,
                        scrollable: true
                    });
                    
                    // 还原位置和大小设置
                    expressionContentEt.alignment = "fill"; // 确保填充父容器
                    expressionContentEt.preferredSize.height = oldHeight;
                    expressionContentEt.helpTip = "表达式内容";
                    
                    // 确保新控件位于正确位置
                    detailsPanel.layout.layout(true);
                } catch (e) {
                    alert("重新创建表达式编辑框时出错: " + e.toString());
                }
            } else {
                // 仅清除内容
                expressionContentEt.text = "";
                if (!makeEditable && !expressionContentEt.readonly) {
                    try {
                        expressionContentEt.readonly = true;
                    } catch(e) {
                        // 忽略错误
                    }
                }
            }
        }
        
        if (!makeEditable) {
            detailsPanel.text = "表达式详情与操作";
        }
    }

    function displayExpressionDetails(expressionFile, categoryForExpression) {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;

        var catToUse = categoryForExpression || currentSelectedCategoryFolder;

        if (!catToUse || !expressionFile) {
            clearDetailsPanel(false);
            return;
        }

        var exprFilePath = baseFolder.fsName + "/" + catToUse + "/" + expressionFile;
        var file = new File(exprFilePath);
        if (file.exists) {
            var content = readFileContent(file);
            var displayName = "";
            try {
                displayName = decodeURIComponent(expressionFile.substring(0, expressionFile.lastIndexOf(EXPRESSION_EXT)));
            } catch (e) {
                displayName = expressionFile.substring(0, expressionFile.lastIndexOf(EXPRESSION_EXT));
            }
            expressionNameEt.text = displayName;
            expressionNameEt.enabled = true;  // Allow editing name of existing expression
            
            // 确保表达式内容编辑框是可编辑的
            try {
                // 检查是否需要重新创建编辑框
                if (expressionContentEt && expressionContentEt.readonly) {
                    // 记住原来控件的位置和大小信息
                    var oldBounds = expressionContentEt.bounds;
                    var oldAlignment = expressionContentEt.alignment;
                    var oldParent = expressionContentEt.parent;
                    var oldHeight = expressionContentEt.preferredSize.height;
                    
                    // 移除旧控件
                    expressionContentEt.parent.remove(expressionContentEt);
                    
                    // 确保按钮组存在且位于编辑框之前
                    if (!btnGroup || !btnGroup.parent) {
                        // 如果按钮组不存在或已被移除，重新创建
                        btnGroup = detailsPanel.add("group");
                        btnGroup.orientation = "row";
                        btnGroup.alignment = ["center", "top"];
                        btnGroup.spacing = 8;
                        btnGroup.margins = [0, 10, 0, 10]; // 保持margins为[0,10,0,10]
                        
                        // 重新创建按钮
                        var deleteBtn = btnGroup.add("button", undefined, "删除");
                        deleteBtn.preferredSize.width = 35;
                        
                        var applyBtn = btnGroup.add("button", undefined, "应用");
                        applyBtn.preferredSize.width = 35;
                        
                        var copyBtn = btnGroup.add("button", undefined, "复制");
                        copyBtn.preferredSize.width = 35;
                        
                        var saveBtn = btnGroup.add("button", undefined, "保存");
                        saveBtn.preferredSize.width = 35;
                        
                        // 更新UI组件引用
                        uiComponents.btnGroup = btnGroup;
                        uiComponents.saveBtn = saveBtn;
                        uiComponents.applyBtn = applyBtn;
                        uiComponents.copyBtn = copyBtn;
                        uiComponents.deleteBtn = deleteBtn;
                    }
                    
                    // 创建新的编辑框（显式设置为非只读）
                    expressionContentEt = detailsPanel.add("edittext", undefined, content, {
                        multiline: true,
                        readonly: false,
                        scrollable: true
                    });
                    
                    // 还原位置和大小设置
                    expressionContentEt.alignment = "fill"; // 确保填充父容器
                    expressionContentEt.preferredSize.height = oldHeight;
                    expressionContentEt.helpTip = "表达式内容";
                    
                    // 确保新控件位于正确位置
                    detailsPanel.layout.layout(true);
                } else if (expressionContentEt) {
                    // 直接设置内容
                    expressionContentEt.text = content;
                    expressionContentEt.readonly = false;
                }
            } catch (e) {
                alert("更新表达式内容时出错: " + e.toString());
                // 出错时的备用方案
                if (expressionContentEt) {
                    expressionContentEt.text = content;
                    expressionContentEt.readonly = false;
                }
            }
            
            if (searchEt.text.toString().trim() !== "") {
                 detailsPanel.text = "表达式详情 (来自: " + categoryMap[catToUse] + ")";
            } else {
                 detailsPanel.text = "表达式详情: " + displayName;
            }

        } else {
            clearDetailsPanel(false);
        }
    }

    // --- Event Handlers ---
    // MODIFIED originalExpressionListOnChange
    var originalExpressionListOnChange = function() {
        if (expressionList.selection) {
            // 处理新建表达式项的选择
            if (expressionList.selection.isNewExpression) {
                handleNewExpressionCreation();
                return;
            }
            
            currentSelectedExpressionFile = expressionList.selection.fileName;
            // Determine category (could be from search result or current category)
            var categoryForDetails = currentSelectedCategoryFolder;
            if (expressionList.selection.originalCategoryFolder) { // If item has originalCategoryFolder, it's from search
                categoryForDetails = expressionList.selection.originalCategoryFolder;
            }
            displayExpressionDetails(currentSelectedExpressionFile, categoryForDetails);
        } else {
            // If detailsPanel indicates "new expression" mode, don't revert to readonly.
            // This check prevents clearing the UI when we are intentionally creating a new expression.
            if (detailsPanel.text.indexOf("新建表达式 (在:") === 0) {
                // Ensure it's editable, as intended in new expression mode
                if (expressionContentEt.readonly) {
                    expressionContentEt.readonly = false;
                }
                if (!expressionNameEt.enabled) {
                    expressionNameEt.enabled = true;
                }
                // currentSelectedExpressionFile is already null for new expressions
                return; // Don't call clearDetailsPanel(false)
            }
            currentSelectedExpressionFile = null;
            clearDetailsPanel(false);
        }
    };


    categoryList.onChange = function() {
        if (this.selection && this.selection.isNewCategory) {
            // 处理新建分类
            handleNewCategoryCreation();
            return;
        }
        
        if (searchEt.text.toString().trim() !== "") {
            searchEt.text = ""; // This will trigger searchEt.onChange, which handles UI reset
            // searchEt.onChange will eventually call this categoryList.onChange again if selection is made
            return;
        }

        expressionList.onChange = originalExpressionListOnChange; // Ensure correct handler

        if (categoryList.selection) {
            currentSelectedCategoryFolder = categoryList.selection.folderName;
            expressionListGroup.text = "表达式列表 (" + categoryList.selection.text + ")";
            populateExpressionList(currentSelectedCategoryFolder);
            if (!expressionList.selection && expressionList.items.length > 1) { // 忽略"新建表达式"选项
                expressionList.selection = 0; // Auto select first expression, will trigger expressionList.onChange
            } else if (expressionList.items.length <= 1) { // 只有"新建表达式"选项
                 clearDetailsPanel(false);
                 currentSelectedExpressionFile = null;
                 detailsPanel.text = "表达式详情与操作"; // Reset panel text
            } else if (expressionList.selection) {
                // If a selection exists (e.g. from populateExpressionList preserving selection), trigger its onChange
                expressionList.onChange();
            }
        } else {
            currentSelectedCategoryFolder = null;
            expressionListGroup.text = "表达式列表";
            clearExpressionList();
            clearDetailsPanel(false);
        }
    };

    categoryList.onDoubleClick = function() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;
        if (!categoryList.selection) return;
        var selectedCatDisplayName = categoryList.selection.text;
        var selectedCatFolderName = categoryList.selection.folderName;

        var action = Window.confirm("管理分类: '" + selectedCatDisplayName + "'\n选择操作：\n是 = 重命名, 否 = 删除, 取消 = 无操作", true, "分类操作");

        if (action === null) return;

        if (action === true) { // Rename
            var newName = Window.prompt("输入新的分类名称:", selectedCatDisplayName, "重命名分类");
            if (newName && newName.trim() && newName.trim() !== selectedCatDisplayName) {
                newName = newName.trim();
                for (var folderKey in categoryMap) {
                    if (categoryMap[folderKey] === newName && folderKey !== selectedCatFolderName) {
                        alert("错误：分类名称 '" + newName + "' 已存在。");
                        return;
                    }
                }
                var newFolderName = globalAccess.safeFolderName(newName);
                if (categoryMap[newFolderName] && newFolderName !== selectedCatFolderName) {
                     alert("错误：无法创建分类文件夹，目标内部名称 '" + newFolderName + "' 可能冲突。");
                     return;
                }
                var oldFolder = new Folder(baseFolder.fsName + "/" + selectedCatFolderName);
                if (selectedCatFolderName === newFolderName) { // Only display name changed
                     categoryMap[selectedCatFolderName] = newName;
                } else { // Folder name also needs to change
                    var newFolderObj = new Folder(baseFolder.fsName + "/" + newFolderName);
                    if (newFolderObj.exists) {
                        alert("错误: 新的分类文件夹目标内部名称 '" + newFolderName + "' 已存在于文件系统。");
                        return;
                    }
                    if (!oldFolder.exists) {
                         alert("错误: 原始分类文件夹 '" + oldFolder.displayName + "' 未找到。");
                         delete categoryMap[selectedCatFolderName];
                         saveCategoryMap();
                         populateCategoryList();
                         return;
                    }
                    if (!oldFolder.rename(newFolderName)) {
                        alert("错误：重命名分类文件夹失败。");
                        return;
                    }
                    delete categoryMap[selectedCatFolderName];
                    categoryMap[newFolderName] = newName;
                }
                saveCategoryMap();
                populateCategoryList();
                // Try to reselect the renamed category
                for(var i=0; i<categoryList.items.length; i++){
                    if(categoryList.items[i].folderName === newFolderName){
                        categoryList.selection = i;
                        break;
                    }
                }
                alert("分类 '" + selectedCatDisplayName + "' 已更新为 '" + newName + "'.");
            }
        } else { // Delete
            if (Window.confirm("确定要删除分类 '" + selectedCatDisplayName + "' 及其所有表达式吗？此操作无法撤销！", false, "确认删除")) {
                var catFolderObj = new Folder(baseFolder.fsName + "/" + selectedCatFolderName);
                if (catFolderObj.exists) {
                    var filesInside = catFolderObj.getFiles();
                    for (var i = 0; i < filesInside.length; i++) { filesInside[i].remove(); }
                    if (catFolderObj.remove()) {
                        delete categoryMap[selectedCatFolderName];
                        saveCategoryMap();
                        var oldSelection = currentSelectedCategoryFolder;
                        populateCategoryList(); // This might change selection or clear it
                        if (oldSelection === selectedCatFolderName) {
                            currentSelectedCategoryFolder = null; // Explicitly clear if deleted one was active
                            clearExpressionList();
                            clearDetailsPanel(false);
                            expressionListGroup.text = "表达式列表";
                        }
                        alert("分类 '" + selectedCatDisplayName + "' 已删除。");
                    } else {
                        alert("错误：删除分类文件夹失败。");
                    }
                } else {
                     alert("错误：找不到要删除的分类文件夹。");
                     delete categoryMap[selectedCatFolderName]; // Remove from map even if folder not found
                     saveCategoryMap();
                     populateCategoryList();
                }
            }
        }
    };

    expressionList.onChange = originalExpressionListOnChange; // Initialize with the correct handler

    expressionList.onDoubleClick = function() {
        // 修改为应用表达式，而不是编辑/删除
        if (!expressionList.selection) return; // 没有选择，不执行任何操作
        
        // 获取选中的表达式内容并应用到当前选中的属性
        var exprContent = expressionContentEt.text;
        if (!exprContent) { 
            alert("没有可应用的表达式内容。"); 
            return;
        }
        
        var activeComp = app.project.activeItem;
        if (!(activeComp instanceof CompItem)) { 
            alert("请先选择一个合成。"); 
                    return;
                }
        
        var selectedProps = activeComp.selectedProperties;
        if (selectedProps.length === 0) { 
            alert("请在合成中选择至少一个属性。"); 
                    return;
                }
        
        app.beginUndoGroup("应用表达式");
        var appliedCount = 0;
        for (var i = 0; i < selectedProps.length; i++) {
            var prop = selectedProps[i];
            if (prop.canSetExpression) {
                try { 
                    prop.expression = exprContent; 
                    appliedCount++; 
                }
                catch (e) { 
                    alert("无法将表达式应用于属性: " + prop.name + "\n" + e.toString()); 
                }
            }
        }
        app.endUndoGroup();
        
        if (appliedCount === 0 && selectedProps.length > 0) {
            alert("选择的属性不支持表达式，或应用失败。");
        } else if (appliedCount > 0) {
            // alert(appliedCount + " 个属性已应用表达式。"); // Optional success message
        }
    };



    saveBtn.onClick = function() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;
        var exprName = expressionNameEt.text.toString().trim();
        var exprContent = expressionContentEt.text;

        if (!exprName) {
            alert("表达式名称不能为空。");
            expressionNameEt.active = true;
            return;
        }

        // Determine the correct category for saving.
        // If an item is selected in the expression list AND it has an originalCategoryFolder,
        // it means we are editing an item found via search. Save it to its original category.
        var categoryForSave = currentSelectedCategoryFolder; // Default to current category
        if (expressionList.selection && expressionList.selection.originalCategoryFolder) {
            categoryForSave = expressionList.selection.originalCategoryFolder;
        } else if (detailsPanel.text.indexOf("新建表达式 (在:") === 0 && currentSelectedCategoryFolder) {
             // This is for a brand new expression being saved.
             // currentSelectedCategoryFolder should be correct.
        } else if (!categoryForSave && currentSelectedExpressionFile) {
            // Fallback: if we are editing an existing file but category is unclear, try to find it (less ideal)
            // This case should be rare if UI logic is correct.
             alert("警告: 无法明确保存的分类，将尝试使用最后选择的分类。");
        }


        if (!categoryForSave) {
            alert("错误：未确定分类。无法保存。");
            return;
        }

        var exprFileName = encodeURIComponent(exprName) + EXPRESSION_EXT;
        var exprFilePath = baseFolder.fsName + "/" + categoryForSave + "/" + exprFileName;
        var file = new File(exprFilePath);

        var isNewExpressionMode = detailsPanel.text.indexOf("新建表达式 (在:") === 0;

        // Case 1: Saving a brand new expression
        if (isNewExpressionMode || currentSelectedExpressionFile === null ) {
            if (file.exists) {
                alert("错误：名称为 '" + exprName + "' 的表达式已存在于分类 '" + categoryMap[categoryForSave] + "' 中。");
                return;
            }
            writeFileContent(file, exprContent);
            currentSelectedExpressionFile = exprFileName; // Update tracker

            if (searchEt.text.toString().trim() !== "") {
                searchEt.onChange(); // Refresh search if it was active
            } else {
                populateExpressionList(categoryForSave);
            }
            // Try to select the newly saved item
            for(var i=0; i<expressionList.items.length; i++){
                var itemIsTarget = expressionList.items[i].fileName === exprFileName;
                if (searchEt.text.toString().trim() !== "" && expressionList.items[i].originalCategoryFolder !== categoryForSave) {
                    itemIsTarget = false; // In search, also match category
                }
                if(itemIsTarget){
                    expressionList.selection = i;
                    break;
                }
            }
            detailsPanel.text = "表达式详情: " + exprName; // Update panel title
            alert("表达式 '" + exprName + "' 已创建并保存到 '" + categoryMap[categoryForSave] + "'。");
        }
        // Case 2: Saving modifications to an existing expression (name change or content change)
        else {
            var oldExprFileName = currentSelectedExpressionFile; // This should be set if not a new expression
            if (!oldExprFileName) {
                 alert("无法确定要修改的原始表达式。请重新选择。");
                 return;
            }
            var oldExprDisplayName = "";
            try { oldExprDisplayName = decodeURIComponent(oldExprFileName.substring(0, oldExprFileName.lastIndexOf(EXPRESSION_EXT))); }
            catch (e) { oldExprDisplayName = oldExprFileName.substring(0, oldExprFileName.lastIndexOf(EXPRESSION_EXT)); }

            if (oldExprFileName !== exprFileName) { // Name has changed
                if (file.exists) {
                    alert("错误：目标名称 '" + exprName + "' 的表达式已存在于分类 '" + categoryMap[categoryForSave] + "' 中。");
                    return;
                }
                var oldFile = new File(baseFolder.fsName + "/" + categoryForSave + "/" + oldExprFileName);
                if (oldFile.exists && oldFile.rename(exprFileName)) {
                    writeFileContent(new File(baseFolder.fsName + "/" + categoryForSave + "/" + exprFileName), exprContent);
                    currentSelectedExpressionFile = exprFileName; // Update tracker

                    if (searchEt.text.toString().trim() !== "") {
                        searchEt.onChange(); // Refresh search
                    } else {
                        populateExpressionList(categoryForSave);
                    }
                     // Try to re-select the renamed item
                    for(var i=0; i<expressionList.items.length; i++){
                        var itemIsTargetRenamed = expressionList.items[i].fileName === exprFileName;
                        if (searchEt.text.toString().trim() !== "" && expressionList.items[i].originalCategoryFolder !== categoryForSave) {
                            itemIsTargetRenamed = false;
                        }
                        if(itemIsTargetRenamed){
                            expressionList.selection = i;
                            break;
                        }
                    }
                    detailsPanel.text = "表达式详情: " + exprName; // Update panel title
                    alert("表达式 '" + oldExprDisplayName + "' 已重命名为 '" + exprName + "' 并保存内容到 '" + categoryMap[categoryForSave] + "'。");
                } else {
                    alert("错误：重命名表达式文件失败 (源: " + oldFile.fsName + ")。确保文件未被占用。");
                }
            } else { // Only content has changed (or no changes)
                writeFileContent(file, exprContent);
                // No need to re-populate list if only content changed and name is same.
                // displayExpressionDetails will update the view if needed.
                // displayExpressionDetails(exprFileName, categoryForSave); // Already done by selection's onChange
                detailsPanel.text = "表达式详情: " + exprName; // Update panel title
                alert("表达式 '" + exprName + "' 的内容已保存到 '" + categoryMap[categoryForSave] + "'。");
            }
        }
        // After saving, the content should be treated as displayed, not actively new/editing.
        // The displayExpressionDetails or selection onChange should handle readonly state.
        // For safety, ensure it's as if an item was just selected.
        if (expressionList.selection) {
            displayExpressionDetails(expressionList.selection.fileName, categoryForSave);
        } else {
            // If somehow no selection after save, clear to a safe state
            clearDetailsPanel(false);
        }
    };


    deleteBtn.onClick = function() {
        if (!expressionList.selection || !currentSelectedExpressionFile) {
            alert("请先选择要删除的表达式。");
            return;
        }
        
        var selectedExprDisplayName = expressionList.selection.text;
        var categoryForThisExpr = expressionList.selection.originalCategoryFolder || currentSelectedCategoryFolder;
        
        if (!categoryForThisExpr) {
            alert("错误：无法确定表达式的分类。");
            return;
        }
        
        // 直接删除，不再显示确认对话框
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;
        
        var exprFolder = baseFolder.fsName + "/" + categoryForThisExpr + "/";
        var fileToDelete = new File(exprFolder + currentSelectedExpressionFile);
        
        if (fileToDelete.exists) {
            if (fileToDelete.remove()) {
                currentSelectedExpressionFile = null; // 清除跟踪器
                
                if (searchEt.text.toString().trim() !== "") {
                    searchEt.onChange(); // 刷新搜索结果
                } else {
                    populateExpressionList(categoryForThisExpr); // 刷新当前分类列表
                }
                
                // 清除详情
                clearDetailsPanel(false);
                if (expressionList.items.length > 0 && !expressionList.selection) {
                    expressionList.selection = 0; // 如果可能，选择第一个
                }
                
                // 不再显示成功删除的提示
            } else {
                alert("错误：删除表达式文件失败。");
            }
        } else {
            alert("错误：找不到要删除的表达式文件。");
        }
    };

    // 提供UI刷新函数
    function refreshUILayout() {
        try {
            if (!win) return;
            
            // 强制窗口重新布局
            if (win.layout) {
                try {
                    win.layout.layout(true);
                } catch(e) {
                    // 忽略布局错误
                }
            }
            
            // 确保主要UI组件可见 - 添加更多检查
            try {
                if (topContainer && typeof topContainer === 'object') {
                    if (typeof topContainer.visible !== 'undefined') {
                        topContainer.visible = true;
                    }
                    if (typeof topContainer.alignment !== 'undefined') {
                        topContainer.alignment = "fill"; // 确保填充整个宽度
                    }
                }
                
                if (mainGroup && typeof mainGroup === 'object' && typeof mainGroup.visible !== 'undefined') {
                    mainGroup.visible = true;
                }
                
                if (leftPanel && typeof leftPanel === 'object' && typeof leftPanel.visible !== 'undefined') {
                    leftPanel.visible = true;
                }
                
                if (rightContainerGroup && typeof rightContainerGroup === 'object' && typeof rightContainerGroup.visible !== 'undefined') {
                    rightContainerGroup.visible = true;
                }
                
                // 确保搜索组件正确显示
                if (searchGroup && typeof searchGroup === 'object') {
                    if (typeof searchGroup.visible !== 'undefined') {
                        searchGroup.visible = true;
                    }
                    if (typeof searchGroup.alignment !== 'undefined') {
                        searchGroup.alignment = "fill"; // 确保填充整个顶部容器
                    }
                }
                
                // 确保名称组件正确显示
                if (nameGroup && typeof nameGroup === 'object') {
                    if (typeof nameGroup.visible !== 'undefined') {
                        nameGroup.visible = true;
                    }
                    if (typeof nameGroup.alignment !== 'undefined') {
                        nameGroup.alignment = "fill"; // 确保填充整个宽度
                    }
                }
                
                // 确保列表可见并重置大小
                if (categoryList && typeof categoryList === 'object') {
                    if (typeof categoryList.visible !== 'undefined') {
                        categoryList.visible = true;
                    }
                    if (categoryList.preferredSize && typeof categoryList.preferredSize.height !== 'undefined') {
                        categoryList.preferredSize.height = 75; // 减小类别列表高度
                    }
                }
                
                if (expressionList && typeof expressionList === 'object') {
                    if (typeof expressionList.visible !== 'undefined') {
                        expressionList.visible = true;
                    }
                    if (expressionList.preferredSize && typeof expressionList.preferredSize.height !== 'undefined') {
                        expressionList.preferredSize.height = 75; // 减半
                    }
                }
            } catch(e) {
                // 捕获并忽略任何访问UI元素时的错误
            }
            
            // 尝试更新面板
            try {
                if (win.update && typeof win.update === 'function') {
                    win.update();
                }
            } catch(e) {
                // 忽略更新错误
            }
            
            // 延迟再次刷新，确保一切就绪 - 使用函数字符串而不是直接调用
            if (win instanceof Panel) {
                try {
                    var taskStr = "try { if(ExpressionPluginGlobalAccess && ExpressionPluginGlobalAccess.refreshUI) ExpressionPluginGlobalAccess.refreshUI(); } catch(e) {}";
                    app.scheduleTask(taskStr, 200, false);
                } catch(e) {
                    // 忽略调度错误
                }
            }
        } catch(e) {
            // 捕获所有错误，防止脚本中断
        }
    }
    
    // 添加到全局访问
    if (globalAccess) {
        globalAccess.refreshUI = refreshUILayout;
    }

    searchEt.onChange = function() {
        // 直接触发搜索，无需等待确认
        // 将直接调用performSearch而不是使用onChanging的延迟机制
        // 这确保在按下回车时立即搜索
        if (searchDelayTimer) {
            app.cancelTask(searchDelayTimer);
            searchDelayTimer = null;
        }
        performSearch(this.text);
    };
    
    // 提取搜索逻辑到单独函数，便于复用
    function performSearch() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;
        var searchTerm = searchEt.text.toString().toLowerCase().trim();

        if (!searchTerm) { // Search cleared
            expressionList.onChange = originalExpressionListOnChange; // Restore original handler
            if (categoryList.selection) {
                // Trigger categoryList.onChange to repopulate expressionList for the current category
                // This will also correctly set expressionList.onChange again if needed and handle selection.
                categoryList.onChange();
            } else if (categoryList.items.length > 0) {
                categoryList.selection = 0; // Select first category if available, triggers categoryList.onChange
            } else { // No categories
                clearExpressionList();
                clearDetailsPanel(false);
                expressionListGroup.text = "表达式列表";
            }
            // Ensure details panel reflects no specific expression if search is cleared and no category action
            if (!categoryList.selection && !expressionList.selection) {
                 detailsPanel.text = "表达式详情与操作";
            }
            return;
        }

        // Search term is present
        expressionList.removeAll();
        // Do not call clearDetailsPanel(false) here, let selection handle it.
        expressionListGroup.text = "搜索结果: '" + searchEt.text.toString().trim() + "'";
        var foundCount = 0;
        var searchResultsData = [];

        for (var catFolder in categoryMap) {
            if (categoryMap.hasOwnProperty(catFolder)) {
                var catFolderObj = new Folder(baseFolder.fsName + "/" + catFolder);
                if (catFolderObj.exists) {
                    var files = catFolderObj.getFiles("*" + EXPRESSION_EXT);
                    for (var i = 0; i < files.length; i++) {
                        if (files[i] instanceof File) {
                            var decodedFileNameNoExt = "";
                            try { decodedFileNameNoExt = decodeURIComponent(files[i].name.substring(0, files[i].name.lastIndexOf(EXPRESSION_EXT))); }
                            catch (e) { decodedFileNameNoExt = files[i].name.substring(0, files[i].name.lastIndexOf(EXPRESSION_EXT)); }
                            var fileContent = readFileContent(files[i]);
                            if (decodedFileNameNoExt.toLowerCase().indexOf(searchTerm) !== -1 ||
                                (fileContent && fileContent.toLowerCase().indexOf(searchTerm) !== -1)) {
                                searchResultsData.push({
                                    displayName: decodedFileNameNoExt,
                                    fileName: files[i].name,
                                    originalCategoryFolder: catFolder, // Store original category
                                    categoryDisplayName: categoryMap[catFolder]
                                });
                                foundCount++;
                            }
                        }
                    }
                }
            }
        }
        searchResultsData.sort(function(a,b) {
            var nameCompare = a.displayName.localeCompare(b.displayName, 'zh-CN');
            if (nameCompare !== 0) return nameCompare;
            return a.categoryDisplayName.localeCompare(b.categoryDisplayName, 'zh-CN');
        });

        var previousSelectionFile = currentSelectedExpressionFile;
        var previousSelectionCat = currentSelectedCategoryFolder; // Or from item.originalCategoryFolder if applicable
        var newSelectionIndex = -1;

        for(var k=0; k < searchResultsData.length; k++) {
            var res = searchResultsData[k];
            var item = expressionList.add("item", res.displayName + " (" + res.categoryDisplayName + ")");
            item.fileName = res.fileName;
            item.originalCategoryFolder = res.originalCategoryFolder; // Attach original category
            if (res.fileName === previousSelectionFile && res.originalCategoryFolder === previousSelectionCat) {
                newSelectionIndex = k;
            }
        }

        // Set up a specific onChange for search results
        expressionList.onChange = function() {
            if (this.selection && this.selection.originalCategoryFolder) {
                currentSelectedExpressionFile = this.selection.fileName;
                // Pass the originalCategoryFolder for displaying details correctly from search
                displayExpressionDetails(this.selection.fileName, this.selection.originalCategoryFolder);
                // When selecting from search, make name and content editable
                expressionNameEt.enabled = true;
                expressionContentEt.readonly = false;
            } else {
                // If no selection in search results, clear details
                clearDetailsPanel(false);
                currentSelectedExpressionFile = null;
                detailsPanel.text = "表达式详情与操作"; // Reset panel title
            }
        };

        if (newSelectionIndex !== -1) {
            expressionList.selection = newSelectionIndex; // Will trigger the search-specific onChange
        } else if (foundCount === 0) {
            var noResultItem = expressionList.add("item", "未找到匹配项。");
            noResultItem.enabled = false;
            clearDetailsPanel(false); // No results, clear details
            currentSelectedExpressionFile = null;
            detailsPanel.text = "表达式详情与操作"; // Reset panel title
        } else if (expressionList.items.length > 0) {
            // expressionList.selection = 0; // Optionally auto-select first search result
            // Let user click, or if auto-selecting, it will trigger the new onChange
        }
         // If no specific selection is made but there are results, don't clear details yet.
         // Let the user's click on a search result populate the details.
         if (!expressionList.selection && foundCount > 0) {
            clearDetailsPanel(false); // No initial selection in search, so clear.
            currentSelectedExpressionFile = null;
            detailsPanel.text = "表达式详情与操作";
         } else if (expressionList.selection) {
            expressionList.onChange(); // Trigger if a selection was made
         }
         }

    // 替换原有的搜索事件处理
    searchEt.onChange = function() {
        // 直接调用上面定义的搜索函数
        performSearch();
    };

    // --- Initialization ---
    function initializePlugin() {
        // 检查全局访问对象
        if (!globalAccess || typeof globalAccess.safeFolderName !== 'function') {
            alert("插件初始化严重错误：核心功能缺失 (safeFolderName)。");
            return;
        }

        var baseFolder = getPluginDataFolder();
        if (!baseFolder) {
            alert("插件初始化失败：无法访问数据存储文件夹。插件功能将受限。");
            // 即使数据文件夹失败，也尝试使UI保持一定功能
            saveBtn.enabled = false;
            return;
        }
        loadCategoryMap(); // 这将处理解析错误并重置

        if (Object.keys(categoryMap).length === 0) { // 如果映射为空（新的或重置的）
            var exampleCategories = [
                // 添加一些示例类别和表达式
                {
                    name: "常用动画",
                    expressions: [
                        { name: "抖动 (Wiggle) - 位置", content: "wiggle(5, 50);" },
                        { name: "抖动 (Wiggle) - 旋转", content: "wiggle(2, 30);" },
                        { name: "循环 (Loop Out)", content: "loopOut();" },
                        { name: "弹性 (Elastic In/Out)", content: "amp = .1;\nfreq = 2.0;\ndecay = 2.0;\nn = 0;\nif (numKeys > 0){\nn = nearestKey(time).index;\nif (key(n).time > time){n--;}\n}\nif (n == 0){ t = 0;}\nelse{t = time - key(n).time;}\nif (n > 0 && t < 1){\n  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n}else{value;}" },
                        { name: "淡入淡出 (Linear Wipe)", content: "linear(time, inPoint, inPoint + 1, 0, 100) - linear(time, outPoint - 1, outPoint, 0, 100);" }
                    ]
                },
                {
                    name: "工具与脚本",
                    expressions: [
                        { name: "根据索引偏移位置", content: "offset = 50; // 每层偏移50像素\nvalue + [index * offset, 0];" },
                        { name: "父级缩放反作用", content: "L = thisComp.layer(\"父级图层名\"); // 替换为你的父级图层名称\ns = L.transform.scale/100;\n[value[0]/s[0], value[1]/s[1]];" },
                        { name: "保持摄像机朝向图层", content: "target = thisComp.layer(\"目标图层名\"); // 替换为你的目标图层名称\nlookAt(position, target.position);" }
                    ]
                },
                {
                    name: "文本动画",
                    expressions: [
                        { name: "打字机效果 (按字符)", content: "L = text.sourceText.length;\nIt = time - thisLayer.inPoint;\nFt = thisComp.frameDuration;\nCharPerSec = 15; // 每秒字符数\nMath.round(L * linear(It, 0, L/CharPerSec, 0, 1));" },
                        { name: "数字计数器", content: "startVal = 0;\nendVal = 1000;\ndur = 2; // 持续时间（秒）\nMath.round(linear(time, inPoint, inPoint + dur, startVal, endVal));" }
                    ]
                }
            ];

            var canWriteOverall = true;
            for (var c = 0; c < exampleCategories.length; c++) {
                var catData = exampleCategories[c];
                var catFolderName = globalAccess.safeFolderName(catData.name);
                var catFolder = new Folder(baseFolder.fsName + "/" + catFolderName);
                
                var canWriteCat = false;
                if (!catFolder.exists) { canWriteCat = catFolder.create(); }
                else { canWriteCat = true; } // 文件夹已存在，假设我们可以写入文件

                if (canWriteCat) {
                    categoryMap[catFolderName] = catData.name; // 添加到映射
                    for (var i = 0; i < catData.expressions.length; i++) {
                        var expr = catData.expressions[i];
                        var exprFileName = encodeURIComponent(expr.name) + EXPRESSION_EXT;
                        var exprFile = new File(catFolder.fsName + "/" + exprFileName);
                        if (!exprFile.exists) { // 仅在不存在时写入，以防覆盖用户的同名默认值
                            writeFileContent(exprFile, expr.content);
                        }
                    }
                } else {
                    canWriteOverall = false;
                    alert("警告：无法写入示例分类 '" + catData.name + "' 到: " + catFolder.fsName + "\n请检查权限。");
                    break; 
                }
            }
            if (canWriteOverall && exampleCategories.length > 0) {
                 saveCategoryMap(); // 保存新填充的映射
            } else if (Object.keys(categoryMap).length === 0 && exampleCategories.length > 0 && !canWriteOverall) {
                 alert("警告：部分或全部示例数据未能写入。");
            }
        }

        populateCategoryList();

        if (categoryList.items.length > 0 && categoryList.selection === null) {
            categoryList.selection = 0; // 自动选择第一个类别，将触发onChange
        } else if (categoryList.items.length > 0 && categoryList.selection !== null) {
             categoryList.onChange(); // 为已选定的类别触发onChange
        } else { // 没有加载或存在类别
            clearExpressionList();
            clearDetailsPanel(false);
            expressionListGroup.text = "表达式列表";
        }
        
        // 强制刷新UI - 添加错误处理
        try {
            if (globalAccess.refreshUILayout) {
                globalAccess.refreshUILayout();
            }
        } catch(e) {
            // 忽略刷新错误
        }
        
        // 延迟再次刷新，确保一切就绪 - 包装在try-catch中
        if (win instanceof Panel) {
            try {
                var taskStr = "try { if(ExpressionPluginGlobalAccess && ExpressionPluginGlobalAccess.refreshUI) ExpressionPluginGlobalAccess.refreshUI(); } catch(e) {}";
                app.scheduleTask(taskStr, 200, false);
            } catch(e) {
                // 忽略调度错误
            }
        }
    }

    if (globalAccess) {
        globalAccess.init = initializePlugin;
    }

    // 调整大小事件处理
    thisObj.onResizing = thisObj.onResize = function () { 
        try {
            if(this.layout) {
                this.layout.resize();
                try {
                    if (globalAccess && globalAccess.refreshUILayout) {
                        globalAccess.refreshUILayout(); // 在大小调整后刷新
                    }
                } catch(e) {
                    // 忽略刷新错误
                }
            }
        } catch(e) {
            // 忽略所有调整大小错误
        }
    };
    
    // 修改onShow处理以适应面板
    if (thisObj instanceof Panel) {
        thisObj.onShow = function() {
            // 使用延迟初始化确保Panel已完全加载
            try {
                var initTaskStr = "try { if(ExpressionPluginGlobalAccess && ExpressionPluginGlobalAccess.init) ExpressionPluginGlobalAccess.init(ExpressionPluginGlobalAccess); } catch(e) { alert('Plugin Init Error:\\n' + e.toString()); }";
                app.scheduleTask(initTaskStr, 100, false);
            } catch(e) {
                // 忽略调度错误
            }
        };
    } else {
        thisObj.onShow = function() {
        if (globalAccess && globalAccess.init) {
                try {
                    var taskString = "try { if(ExpressionPluginGlobalAccess && ExpressionPluginGlobalAccess.init) ExpressionPluginGlobalAccess.init(ExpressionPluginGlobalAccess); } catch(e) { alert('Plugin Init Error (from scheduleTask):\\n' + e.toString() + '\\n' + e.fileName + ' line ' + e.line); }";
            app.scheduleTask(taskString, 50, false);
                } catch(e) {
                    // 忽略调度错误
                    alert("初始化插件时出错: " + e.toString());
                }
        } else {
            alert("Initialization function not found for plugin.");
        }
    };
    }

    // 面板立即调用初始化函数
    if (thisObj instanceof Panel) {
        // 使用延迟初始化 - 替换setTimeout为app.scheduleTask
        try {
            var panelInitTask = "try { if(ExpressionPluginGlobalAccess && ExpressionPluginGlobalAccess.init) ExpressionPluginGlobalAccess.init(ExpressionPluginGlobalAccess); } catch(e) { alert('Plugin Init Error:\\n' + e.toString()); }";
            app.scheduleTask(panelInitTask, 100, false);
        } catch(e) {
            // 忽略调度错误
        }
    }
    
    // Window类型时的处理
    if (thisObj instanceof Window) {
        thisObj.center();
        thisObj.show();
    }

    // 初始化类别列表
    function loadCategories() {
        populateCategoryList(); // 调用已存在的方法填充类别列表
    }

    // 添加搜索功能
    function performSearch(searchTerm) {
        searchTerm = searchTerm.toString().toLowerCase().trim();
        
        if (searchTerm === "") {
            // 清空搜索并恢复到当前选中的类别
            if (currentSelectedCategoryFolder) {
                populateExpressionList(currentSelectedCategoryFolder);
    } else {
                expressionList.removeAll();
            }
            return;
        }
        
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;
        
        // 清空表达式列表
        expressionList.removeAll();
        
        // 获取所有类别文件夹
        var categoryFolders = baseFolder.getFiles(function(file) {
            return file instanceof Folder;
        });
        
        var foundCount = 0;
        
        // 搜索所有类别中的表达式
        for (var i = 0; i < categoryFolders.length; i++) {
            var categoryFolder = categoryFolders[i];
            var categoryName = decodeURIComponent(categoryFolder.name);
            var expressionFiles = categoryFolder.getFiles("*" + EXPRESSION_EXT);
            
            for (var j = 0; j < expressionFiles.length; j++) {
                var exprFile = expressionFiles[j];
                var exprName = decodeURIComponent(exprFile.name.replace(EXPRESSION_EXT, ""));
                
                // 如果表达式名称包含搜索词，添加到列表
                if (exprName.toLowerCase().indexOf(searchTerm) !== -1) {
                    var item = expressionList.add("item", exprName);
                    item.fileName = exprFile.name;
                    item.originalCategoryFolder = categoryFolder.name;
                    foundCount++;
                } else {
                    // 如果名称不匹配，尝试搜索内容
                    try {
                        if (exprFile.open("r")) {
                            var content = exprFile.read();
                            exprFile.close();
                            
                            if (content.toLowerCase().indexOf(searchTerm) !== -1) {
                                var item = expressionList.add("item", exprName);
                                item.fileName = exprFile.name;
                                item.originalCategoryFolder = categoryFolder.name;
                                foundCount++;
                            }
                        }
                    } catch (e) {
                        // 忽略读取错误
                    }
                }
            }
        }
        
        // 如果没有结果，显示空状态
        if (foundCount === 0) {
            expressionList.add("item", "-- 未找到结果 --");
        }
    }

    // 修改搜索文本框的onChange事件处理器，使其直接响应输入
    searchEt.onChange = function() {
        performSearch(this.text);
    };
    
    // 优化：添加实时搜索，立即响应用户输入
    var searchDelayTimer = null;
    searchEt.onChanging = function() {
        if (searchDelayTimer) {
            app.cancelTask(searchDelayTimer);
        }
        // 非常短的延迟，几乎实时响应输入
        searchDelayTimer = app.scheduleTask(performSearchNow, 50, false);
    };
    
    function performSearchNow() {
        searchDelayTimer = null;
        performSearch(searchEt.text);
    }

    // 添加应用按钮的点击处理程序
    applyBtn.onClick = function() {
        var exprContent = expressionContentEt.text;
        if (!exprContent) { 
            alert("没有可应用的表达式内容。"); 
            return; 
        }
        
        var activeComp = app.project.activeItem;
        if (!(activeComp instanceof CompItem)) { 
            alert("请先选择一个合成。"); 
            return; 
        }
        
        var selectedProps = activeComp.selectedProperties;
        if (selectedProps.length === 0) { 
            alert("请在合成中选择至少一个属性。"); 
            return; 
        }
        
        app.beginUndoGroup("应用表达式");
        var appliedCount = 0;
        for (var i = 0; i < selectedProps.length; i++) {
            var prop = selectedProps[i];
            if (prop.canSetExpression) {
                try { 
                    prop.expression = exprContent; 
                    appliedCount++; 
                }
                catch (e) { 
                    alert("无法将表达式应用于属性: " + prop.name + "\n" + e.toString()); 
                }
            }
        }
        app.endUndoGroup();
        
        if (appliedCount === 0 && selectedProps.length > 0) {
            alert("选择的属性不支持表达式，或应用失败。");
        } else if (appliedCount > 0) {
            // alert(appliedCount + " 个属性已应用表达式。"); // Optional success message
        }
    };
    
    // 添加复制按钮的点击处理程序
    copyBtn.onClick = function() {
        var exprContent = expressionContentEt.text;
        if (!exprContent) { 
            alert("没有内容可复制。"); 
            return;
        }
        
        // 使用系统剪贴板 - After Effects会处理这种临时文本框复制方式而不会闪退
        try {
            // 创建临时文本框
            var tempDialog = new Window("dialog", "复制到剪贴板");
            tempDialog.orientation = "column";
            var tempField = tempDialog.add("edittext", undefined, exprContent, {multiline: true, readonly: false});
            tempField.preferredSize.width = 450;
            tempField.preferredSize.height = 150;
            tempField.active = true;
            
            // 在脚本中创建复制按钮，而不是依赖用户手动复制
            var btnRow = tempDialog.add("group");
            btnRow.orientation = "row";
            btnRow.alignment = "center";
            var copyNowBtn = btnRow.add("button", undefined, "复制到剪贴板");
            var closeBtn = btnRow.add("button", undefined, "关闭", {name: "cancel"});
            
            copyNowBtn.onClick = function() {
                tempField.textselection = exprContent; // 全选文本
                tempField.active = true; // 确保文本框获得焦点
                app.executeCommand(app.findMenuCommandId("Copy")); // 执行"复制"命令
                alert("已复制到剪贴板");
                tempDialog.close();
            };
            
            tempDialog.show();
        } catch(e) {
            // 如果上面的方法失败，尝试使用简单方法
            alert("复制表达式内容到剪贴板:\n请先全选文本(Ctrl+A/Cmd+A)，然后复制(Ctrl+C/Cmd+C)，完成后按确定。\n\n" + exprContent);
        }
    };

    // 处理新建分类选项的函数
    function handleNewCategoryCreation() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;
        var newCatName = Window.prompt("输入新分类的名称:", "新分类", "新建分类");
        if (newCatName && newCatName.trim()) {
            newCatName = newCatName.trim();
            for (var folderNameKey in categoryMap) {
                if (categoryMap[folderNameKey] === newCatName) {
                    alert("错误：分类名称 '" + newCatName + "' 已存在。");
                    return;
                }
            }
            var folderName = globalAccess.safeFolderName(newCatName);
            var newFolder = new Folder(baseFolder.fsName + "/" + folderName);

            if (newFolder.exists || categoryMap[folderName]) {
                alert("错误：无法创建分类 '" + newCatName + "'。文件夹可能已存在或内部名称冲突。");
                return;
            }
            if (newFolder.create()) {
                categoryMap[folderName] = newCatName;
                saveCategoryMap();
                populateCategoryList();
                for(var i=0; i<categoryList.items.length; i++){
                    if(categoryList.items[i].folderName === folderName){
                        categoryList.selection = i; // This will trigger categoryList.onChange
                        break;
                    }
                }
                alert("分类 '" + newCatName + "' 已创建。");
            } else {
                alert("错误：创建分类文件夹失败。");
            }
        } else {
            // 如果用户取消，恢复到之前的选择
            if (categoryList.items.length > 1) {
                categoryList.selection = 0; // 默认选择第一个非"新建分类"项
            }
        }
    }
    
    // 处理新建表达式选项的函数
    function handleNewExpressionCreation() {
        var baseFolder = getPluginDataFolder();
        if (!baseFolder) return;

        if (!currentSelectedCategoryFolder) {
            alert("请先选择或创建一个分类。");
            return;
        }

        // If a search was active, clear it.
        if (searchEt.text.toString().trim() !== "") {
            searchEt.text = ""; 
        }
        
        // Ensure the onChange handler for expressionList is the original one.
        expressionList.onChange = originalExpressionListOnChange;

        // 清除列表选择并重置当前文件
        // 最后一项是"+ 新建表达式"
        if (expressionList.items.length > 0) {
            expressionList.selection = expressionList.items.length - 1;
        }
        currentSelectedExpressionFile = null;
        
        // 设置名称字段
        expressionNameEt.enabled = true;
        expressionNameEt.text = "新表达式";
        
        // 更新面板标题
        detailsPanel.text = "新建表达式 (在: " + categoryMap[currentSelectedCategoryFolder] + ")";
        
        try {
            // 重要：完全移除旧的编辑框并创建新的
            if (expressionContentEt) {
                // 记住原来控件的位置和大小信息
                var oldBounds = expressionContentEt.bounds;
                var oldAlignment = expressionContentEt.alignment;
                var oldParent = expressionContentEt.parent;
                var oldHeight = expressionContentEt.preferredSize.height;
                
                // 移除旧控件
                expressionContentEt.parent.remove(expressionContentEt);
                
                // 创建新的编辑框（显式设置为非只读）
                expressionContentEt = detailsPanel.add("edittext", undefined, "// 在此输入表达式代码", {
                    multiline: true,
                    readonly: false,
                    scrollable: true
                });
                
                // 还原位置和大小设置
                expressionContentEt.alignment = oldAlignment;
                expressionContentEt.preferredSize.height = oldHeight;
                expressionContentEt.helpTip = "表达式内容";
                
                // 确保新控件位于正确位置（在名称组和动作组之间）
                detailsPanel.layout.layout(true);
                
                // 激活新控件
                expressionContentEt.active = true;
            }
        } catch (e) {
            alert("创建编辑控件时出错: " + e.toString());
        }
        
        // 最后再设置名称字段的焦点
        expressionNameEt.active = true;
    }
}