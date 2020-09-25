export * from './notification.module';
// TODO: Deprecate NotificationsModule module usage (Only NotificationModule should be supported)
export { SbbNotificationModule as NotificationsModule } from './notification.module';
export * from './notification/notification.component';
/** @deprecated Remove with v12 */
export { SbbNotificationModule as NotificationModule } from './notification.module';
/** @deprecated Remove with v12 */
export {
  SbbJumpMark as JumpMark,
  SbbNotification as NotificationComponent,
} from './notification/notification.component';
