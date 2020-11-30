import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

export default apiInitializer("0.8", api => {
  api.modifyClass("component:navigation-bar", {
    classNameBindings: ["isCustomNav"],
    showCustomVersion: "isCustomNav",
    router: service("router"),

    @discourseComputed("site.isMobileDevice", "router.currentRouteName")
    isCustomNav(isMobile, routeName) {
      let isTagPage = routeName.split(".")[0] === "tag";
      let isHomePage = routeName=== "discovery.latest" || 
        routeName === "discovery.top" ||
        routeName === "discovery.categories";
      return isMobile || isTagPage || isHomePage;
    }
  });
});