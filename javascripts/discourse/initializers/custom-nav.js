import { apiInitializer } from "discourse/lib/api";
import { alias } from "@ember/object/computed";
import discourseComputed from "discourse-common/utils/decorators";
import { inject as service } from "@ember/service";

export default apiInitializer("0.8", api => {
  api.modifyClass("component:navigation-bar", {
    classNameBindings: ["showCompactNav:compact-version"],
    showCompactVersion: alias("showCompactNav"),
    router: service("router"),

    @discourseComputed("site.isMobileDevice", "router.currentRouteName")
    showCompactNav(isMobile, routeName) {

      let showOnHome = settings.on_home_page;
      let showOnTag = settings.on_tag_pages;
      let showOnCategory = settings.on_category_pages;

      let isTagPage = showOnTag === true &&
        routeName.split(".")[0] === "tag" || 
        routeName.split(".")[0] === "tags";

      let isHomePage = showOnHome === true &&
        routeName === "discovery.latest" || 
        routeName === "discovery.top" ||
        routeName === "discovery.topAll" ||
        routeName === "discovery.topYearly" ||
        routeName === "discovery.topQuarterly" ||
        routeName === "discovery.topMonthly" ||
        routeName === "discovery.topWeekly" ||
        routeName === "discovery.topDaily" ||
        routeName === "discovery.unread" ||
        routeName === "discovery.new";

      let isCategoryPage = showOnCategory === true &&
        routeName === "discovery.category" ||
        routeName === "discovery.latestCategory" ||
        routeName === "discovery.categories" ||
        routeName === "discovery.topCategory" ||
        routeName === "discovery.topAllCategory" ||
        routeName === "discovery.topYearlyCategory" ||
        routeName === "discovery.topQuarterlyCategory" ||
        routeName === "discovery.topMonthlyCategory" ||
        routeName === "discovery.topWeeklyCategory" ||
        routeName === "discovery.topDailyCategory" ||
        routeName === "discovery.categoryAll" ||
        routeName === "discovery.categoryNone";
      
      return isMobile || isTagPage || isHomePage || isCategoryPage;
    }
  });
});
