from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import token_obtain_pair, token_refresh

import corona.views
import dishes.views
import users.views
from global_preferences.views import CustomGlobalPreferencesViewSet

admin.site.site_header = "Samuel administration"

router = DefaultRouter()
router.register("dishes", dishes.views.ScheduledDishViewSet, base_name="dishes")
router.register("users", users.views.UsersViewSet, base_name="users")
router.register("preferences", CustomGlobalPreferencesViewSet, base_name="preferences")
router.register("corona", corona.views.HealthStatementViewSet, base_name="corona")

api_patterns = [
    path("", include(router.urls)),
    path("token/", token_obtain_pair, name="token_obtain_pair"),
    path("token/refresh/", token_refresh, name="token_refresh"),
    path("auth/", include("rest_framework.urls")),
]

urlpatterns = [path("admin/", admin.site.urls), path("api/", include(api_patterns))]

# Serve media
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
