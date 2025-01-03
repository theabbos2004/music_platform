import {
  omit
} from "./chunk-QWBLDZ7I.js";
import {
  BarsOutlined_default,
  LeftOutlined_default,
  RightOutlined_default
} from "./chunk-QNBAFOYJ.js";
import {
  ConfigContext
} from "./chunk-JSYVD3HQ.js";
import {
  require_classnames
} from "./chunk-AHKMZG35.js";
import {
  require_react
} from "./chunk-4SFRHSJ3.js";
import {
  __toESM
} from "./chunk-EQCVQC35.js";

// node_modules/antd/es/layout/Sider.js
var React2 = __toESM(require_react());
var import_react = __toESM(require_react());
var import_classnames = __toESM(require_classnames());

// node_modules/antd/es/_util/isNumeric.js
var isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);
var isNumeric_default = isNumeric;

// node_modules/antd/es/layout/context.js
var React = __toESM(require_react());
var LayoutContext = React.createContext({
  siderHook: {
    addSider: () => null,
    removeSider: () => null
  }
});

// node_modules/antd/es/layout/Sider.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var dimensionMaxMap = {
  xs: "479.98px",
  sm: "575.98px",
  md: "767.98px",
  lg: "991.98px",
  xl: "1199.98px",
  xxl: "1599.98px"
};
var SiderContext = React2.createContext({});
var generateId = /* @__PURE__ */ (() => {
  let i = 0;
  return function() {
    let prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    i += 1;
    return `${prefix}${i}`;
  };
})();
var Sider = React2.forwardRef((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    trigger,
    children,
    defaultCollapsed = false,
    theme = "dark",
    style = {},
    collapsible = false,
    reverseArrow = false,
    width = 200,
    collapsedWidth = 80,
    zeroWidthTriggerStyle,
    breakpoint,
    onCollapse,
    onBreakpoint
  } = props, otherProps = __rest(props, ["prefixCls", "className", "trigger", "children", "defaultCollapsed", "theme", "style", "collapsible", "reverseArrow", "width", "collapsedWidth", "zeroWidthTriggerStyle", "breakpoint", "onCollapse", "onBreakpoint"]);
  const {
    siderHook
  } = (0, import_react.useContext)(LayoutContext);
  const [collapsed, setCollapsed] = (0, import_react.useState)("collapsed" in props ? props.collapsed : defaultCollapsed);
  const [below, setBelow] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    if ("collapsed" in props) {
      setCollapsed(props.collapsed);
    }
  }, [props.collapsed]);
  const handleSetCollapsed = (value, type) => {
    if (!("collapsed" in props)) {
      setCollapsed(value);
    }
    onCollapse === null || onCollapse === void 0 ? void 0 : onCollapse(value, type);
  };
  const responsiveHandlerRef = (0, import_react.useRef)();
  responsiveHandlerRef.current = (mql) => {
    setBelow(mql.matches);
    onBreakpoint === null || onBreakpoint === void 0 ? void 0 : onBreakpoint(mql.matches);
    if (collapsed !== mql.matches) {
      handleSetCollapsed(mql.matches, "responsive");
    }
  };
  (0, import_react.useEffect)(() => {
    function responsiveHandler(mql2) {
      return responsiveHandlerRef.current(mql2);
    }
    let mql;
    if (typeof window !== "undefined") {
      const {
        matchMedia
      } = window;
      if (matchMedia && breakpoint && breakpoint in dimensionMaxMap) {
        mql = matchMedia(`screen and (max-width: ${dimensionMaxMap[breakpoint]})`);
        try {
          mql.addEventListener("change", responsiveHandler);
        } catch (error) {
          mql.addListener(responsiveHandler);
        }
        responsiveHandler(mql);
      }
    }
    return () => {
      try {
        mql === null || mql === void 0 ? void 0 : mql.removeEventListener("change", responsiveHandler);
      } catch (error) {
        mql === null || mql === void 0 ? void 0 : mql.removeListener(responsiveHandler);
      }
    };
  }, [breakpoint]);
  (0, import_react.useEffect)(() => {
    const uniqueId = generateId("ant-sider-");
    siderHook.addSider(uniqueId);
    return () => siderHook.removeSider(uniqueId);
  }, []);
  const toggle = () => {
    handleSetCollapsed(!collapsed, "clickTrigger");
  };
  const {
    getPrefixCls
  } = (0, import_react.useContext)(ConfigContext);
  const renderSider = () => {
    const prefixCls = getPrefixCls("layout-sider", customizePrefixCls);
    const divProps = omit(otherProps, ["collapsed"]);
    const rawWidth = collapsed ? collapsedWidth : width;
    const siderWidth = isNumeric_default(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    const zeroWidthTrigger = parseFloat(String(collapsedWidth || 0)) === 0 ? React2.createElement("span", {
      onClick: toggle,
      className: (0, import_classnames.default)(`${prefixCls}-zero-width-trigger`, `${prefixCls}-zero-width-trigger-${reverseArrow ? "right" : "left"}`),
      style: zeroWidthTriggerStyle
    }, trigger || React2.createElement(BarsOutlined_default, null)) : null;
    const iconObj = {
      expanded: reverseArrow ? React2.createElement(RightOutlined_default, null) : React2.createElement(LeftOutlined_default, null),
      collapsed: reverseArrow ? React2.createElement(LeftOutlined_default, null) : React2.createElement(RightOutlined_default, null)
    };
    const status = collapsed ? "collapsed" : "expanded";
    const defaultTrigger = iconObj[status];
    const triggerDom = trigger !== null ? zeroWidthTrigger || React2.createElement("div", {
      className: `${prefixCls}-trigger`,
      onClick: toggle,
      style: {
        width: siderWidth
      }
    }, trigger || defaultTrigger) : null;
    const divStyle = Object.assign(Object.assign({}, style), {
      flex: `0 0 ${siderWidth}`,
      maxWidth: siderWidth,
      minWidth: siderWidth,
      width: siderWidth
    });
    const siderCls = (0, import_classnames.default)(prefixCls, `${prefixCls}-${theme}`, {
      [`${prefixCls}-collapsed`]: !!collapsed,
      [`${prefixCls}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
      [`${prefixCls}-below`]: !!below,
      [`${prefixCls}-zero-width`]: parseFloat(siderWidth) === 0
    }, className);
    return React2.createElement("aside", Object.assign({
      className: siderCls
    }, divProps, {
      style: divStyle,
      ref
    }), React2.createElement("div", {
      className: `${prefixCls}-children`
    }, children), collapsible || below && zeroWidthTrigger ? triggerDom : null);
  };
  const contextValue = React2.useMemo(() => ({
    siderCollapsed: collapsed
  }), [collapsed]);
  return React2.createElement(SiderContext.Provider, {
    value: contextValue
  }, renderSider());
});
if (true) {
  Sider.displayName = "Sider";
}
var Sider_default = Sider;

export {
  LayoutContext,
  SiderContext,
  Sider_default
};
//# sourceMappingURL=chunk-QPE4HDTF.js.map
