// ============================================
// Feirinha Express - UI Components Index
// Limpo e sem duplicatas
// ============================================

// === BASE COMPONENTS ===
export { Button } from './button'
export { Input } from './input'
export { Card } from './card'
export { Badge } from './badge'
export { Chip } from './chip'
export { ProductCard } from './product-card'
export { StoreCard } from './store-card'
export { NavBar } from './navbar'
export { BottomNav } from './bottom-nav'
export { SectionTitle } from './section-title'
export { Modal, ConfirmModal } from './modal'
export { ToastContainer, toast } from './toast'
export { ThemeToggle } from './theme-toggle'
export { Star } from './star-rating'

// === SKELETON & LOADING ===
export { Skeleton, ProductCardSkeleton } from './skeleton'
export { AnimatedButton, LikeButton, AnimatedToggle, AddToCartButton, HeartBurst, ProgressSteps, SwipeToReveal, AnimatedCounter, ShakeOnError } from './micro-interactions'

// === EMPTY STATES ===
export { EmptyState, EmptyCart, EmptyOrders, EmptyFavorites, EmptySearch, EmptyNotifications, EmptyAddress, EmptyRewards, EmptyReviews, EmptyProduct, EmptyStore, EmptyChat, EmptyPayments, LoadingState, ErrorState, OfflineState } from './empty-states'

// === SHARING ===
export { ShareButton, ProductShare, OrderShare, StoreShare, ReferralShare, useShare } from './share-button'

// === OFFLINE ===
export { OfflineBanner } from './offline-banner'
export { OfflineProvider, useOfflineStatus, ConnectionQualityIndicator, SyncQueueManager, OfflineDataInfo, OfflinePageWrapper, OfflineDemo } from './offline-system'

// === SEARCH ===
export { RecentSearches } from './recent-searches'
export { AdvancedSearch } from './advanced-search'
export { AdvancedSearchPage, SearchBar, SearchSuggestions, SearchResults, SearchProvider, useRecentSearches, useSearchSuggestions } from './search-system'
export { useSearchHistory, SearchBarWithHistory as SearchBarWithHistoryNew, SearchSuggestionsList, SearchEmptyState, TypewriterSuggestion, RecentSearchesWidget, SearchHistoryDemo } from './search-history'

// === PRODUCT ===
export { ProductDetails } from './product-details'
export { ProductReviews } from './product-reviews'
export { ProductComparison } from './product-comparison'
export { ProductFilters, FilterChips } from './product-filters'
export { ProductCatalog } from './product-catalog'
export { ProductCatalogView, ProductQuickView } from './product-catalog-view'
export { ProductGallery } from './product-gallery'

// === STORES ===
export { StoreLocator } from './store-locator'
export { StoreDiscovery, NearbyStoresMap } from './store-discovery'
export { StoreRegistration } from './store-registration'
export { MerchantProfile } from './merchant-profile'
export { FeaturedStores, FeaturedStoresCompact } from './featured-stores'

// === NOTIFICATIONS ===
export { NotificationBell } from './notification-bell'
export { NotificationSettings } from './notification-settings'
export { NotificationProvider, useNotifications, NotificationItem, NotificationList, NotificationDemo } from './notifications-push'
export { NotificationsPage as NotificationSystem, PushNotificationPermission, NotificationBadge } from './notifications-system'
export { NotificationsList } from './notifications-list'

// === CART & CHECKOUT ===
export { FloatingCart } from './floating-cart'
export { ShoppingCart } from './shopping-cart'
export { CouponInput, useCoupon } from './coupon-input'
export { CheckoutPayment } from './checkout-payment'
export { OrderSummary, OrderTimeline, OrderReceipt } from './order-summary'
export { OrderConfirmation } from './order-confirmation'
export { DeliveryFeeCalculator, OrderTotalCalculator } from './delivery-calculator'

// === ORDERS ===
export { OrderHistory } from './order-history'
export { OrderTracker, OrderTrackingDemo } from './order-tracker'
export { LiveTrackingMap, DeliveryPersonCard, TrackingTimeline, EstimatedArrival, OrderTrackingPage, OrderStatusBadge } from './order-tracking'
export { DeliveryTracker } from './delivery-tracker'
export { DeliveryTimeEstimator, LiveDeliveryTracker } from './delivery-time'
export { DeliveryScheduler } from './delivery-scheduler'
export { DeliveryAddress } from './delivery-address'

// === REVIEWS ===
export { WriteReview, ReviewList } from './write-review'
export { ReviewSection } from './review-section'
export { StarRatingInput, StarRatingDisplay, ReviewStatsCard, ReviewCard, WriteReviewForm, ReviewsList, PendingReviews, ReviewsPage } from './reviews-system'

// === FAVORITES ===
export { FavoritesPage, FavoriteButton } from './favorites'
export { FavoritesProvider, useFavorites, ProductFavoritesList, StoreFavoritesList, QuickFavoritesWidget } from './favorites-system'

// === ADDRESS ===
export { AddressManager } from './address-manager'
export { AddressManager as AddressManagerComplete } from './address-manager-complete'
export { AddressCard, AddressForm, AddressMapPicker } from './address-management'

// === PAYMENT ===
export { PaymentMethods } from './payment-methods'
export { PaymentMethodsComplete, CardInputForm } from './payment-methods-complete'
export { WalletPage } from './wallet-page'
export { WalletBalanceCard, PaymentMethodsList, AddCardForm, TransactionHistory, PixKeyManager } from './payment-wallet'

// === MERCHANT ===
export { MerchantDashboard } from './merchant-dashboard'
export { MerchantDashboardComplete } from './merchant-dashboard-complete'
export { MerchantAnalytics } from './merchant-analytics'
export { MerchantProductManager } from './merchant-products'
export { CreatePromotion } from './create-promotion'

// === PROFILE ===
export { UserProfile } from './user-profile'
export { ProfileSettings, VerificationBadges } from './profile-settings'
export { ProfileHeader, ProfileEditForm, SettingsSection, SettingsPage, ProfilePage } from './profile-settings'

// === LOYALTY & REWARDS ===
export { LoyaltyProgram } from './loyalty-program'
export { LoyaltyPointsTracker, PointsAnimation } from './loyalty-tracker'
export { UserDashboard, ProgressBar, MiniChart } from './user-dashboard'
export { UserProgressCard, BadgesSection, DailyChallenges, RewardsShop, Leaderboard, PointsHistory } from './gamification'

// === HELP ===
export { HelpCenter } from './help-center'
export { HelpArticles } from './help-articles'
export { HelpCenterPage, ContactForm } from './help-center'
export { SupportChat, ConversationList, GroupChat } from './support-chat'
export { ChatList, ChatWindow, SupportChatPage, useChat } from './chat-system'

// === ONBOARDING ===
export { OnboardingFlow, OnboardingSlider, LocationPermission, CategorySelection, NotificationPermission, CompleteOnboarding } from './onboarding'

// === COMPARISON & RECOMMENDATIONS ===
export { ProductComparisonView, PriceAlertSystem, SmartRecommendations } from './comparison-features'
export { RecentlyViewed, RecentlyViewedHorizontal } from './recently-viewed'
export { Recommendations, RecommendationsHorizontal } from './recommendations'

// === ACTIVITY & GAMES ===
export { ActivityFeed } from './activity-feed'
export { SpinWheel, LuckyNumber, PromoGameBanner } from './promo-games'
export { ReferralProgram } from './referral-program'

// === FILTERS & FORMS ===
export { AdvancedFilters } from './advanced-filters'
export { PullToRefresh } from './pull-to-refresh'
export { ValidatedInput } from './validated-input'
export { ValidationFormsDemo, AnimationsDemo } from './validation-demo'

// === ANALYTICS ===
export { AnalyticsDashboard, MetricsCard, MetricsChart, PieChart, RealtimeCounter, useAnalytics } from './analytics-dashboard'

// === SETTINGS & QUICK ACTIONS ===
export { QuickActions, StatsCard } from './quick-actions'
export { FloatingActionButton, QuickActionsPanel, KeyboardShortcutsHelp, useKeyboardShortcuts, ThemeSwitcher, AccentColorPicker, AppearanceSettings } from './quick-settings'

// === ORDER WIDGET ===
export { FloatingOrderWidget, OrderTimelineCompact, DeliveryEstimateCalculator as DeliveryEstimateCalc, OrderStatusSelector } from './floating-order-widget'

// === PROMO ===
export { PromoBannerCarousel, PromoBanner } from './promo-banner'
export { PromoDiscovery } from './promo-discovery'

// === LIVE CHAT ===
export { LiveChat } from './live-chat'

// === PROMO & COUPONS ===
export { CouponCard, PromoCodeInput, PromotionsBanner, DealOfDay, ComboDeal, PromotionsPage } from './promo-coupons'

// === QUICK VIEW ===
export { ImageGallery, ProductVariants, ProductExtras, ProductQuantity, QuickViewModal, ProductCardQuickView, ProductGridQuickView } from './product-quick-view'

// === ERROR PAGES ===
export { NotFoundPage, ServerErrorPage, MaintenancePage } from './not-found-page'

// === NEW FEATURES ===
// These are standalone components that can be imported directly from their files
// Use: import { ReferralCard } from '@/components/ui/gamification'
// Use: import { ChallengeCard } from '@/components/ui/gamification'