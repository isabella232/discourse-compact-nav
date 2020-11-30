import { next } from "@ember/runloop";
import Component from "@ember/component";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import DiscourseURL from "discourse/lib/url";
import { renderedConnectorsFor } from "discourse/lib/plugin-connectors";
import FilterModeMixin from "discourse/mixins/filter-mode";
import { inject as service } from "@ember/service";

export default Component.extend(FilterModeMixin, {
  tagName: "ul",
  classNameBindings: [":nav", ":nav-pills", "isCustomNav"],
  elementId: "navigation-bar",
  showCustomVersion: null,
  router: service("router"),

  init() {
    this._super(...arguments);
    this.set("connectors", renderedConnectorsFor("extra-nav-item", null, this));

    // custom AGC code
    // if mobile, tag pages, or home page... show custom version
    
    let isMobile = this.site.isMobileDevice;
    let isTagPage = this.router.currentRouteName.split(".")[0] === "tag";
    let isHomePage = this.router.currentRouteName === "discovery.latest" || 
    this.router.currentRouteName === "discovery.top" ||
    this.router.currentRouteName === "discovery.categories";

    if (isMobile || isTagPage || isHomePage) {
      this.set("showCustomVersion", true);
    } else {
      this.set("showCustomVersion", false);
    }
    
  },

  @discourseComputed("showCustomVersion")
  isCustomNav(showCustomVersion) {
    return showCustomVersion === true ? "custom-version" : "";
  },

  @discourseComputed("filterType", "navItems")
  selectedNavItem(filterType, navItems) {
    let item = navItems.find((i) => i.active === true);

    item = item || navItems.find((i) => i.get("filterType") === filterType);

    if (!item) {
      let connectors = this.connectors;
      let category = this.category;
      if (connectors && category) {
        connectors.forEach((c) => {
          if (
            c.connectorClass &&
            typeof c.connectorClass.path === "function" &&
            typeof c.connectorClass.displayName === "function"
          ) {
            let path = c.connectorClass.path(category);
            if (path.indexOf(filterType) > 0) {
              item = {
                displayName: c.connectorClass.displayName(),
              };
            }
          }
        });
      }
    }
    return item || navItems[0];
  },

  @observes("expanded")
  closedNav() {
    if (!this.expanded) {
      this.ensureDropClosed();
    }
  },

  ensureDropClosed() {
    if (!this.expanded) {
      this.set("expanded", false);
    }
    $(window).off("click.navigation-bar");
    DiscourseURL.appEvents.off("dom:clean", this, this.ensureDropClosed);
  },

  actions: {
    toggleDrop() {
      this.set("expanded", !this.expanded);

      if (this.expanded) {
        DiscourseURL.appEvents.on("dom:clean", this, this.ensureDropClosed);

        next(() => {
          if (!this.expanded) {
            return;
          }

          $(this.element.querySelector(".drop a")).on("click", () => {
            this.element.querySelector(".drop").style.display = "none";

            next(() => {
              if (!this.element || this.isDestroying || this.isDestroyed) {
                return;
              }
              this.set("expanded", false);
            });

            return true;
          });

          $(window).on("click.navigation-bar", () => {
            this.set("expanded", false);
            return true;
          });
        });
      }
    },
  },
});
