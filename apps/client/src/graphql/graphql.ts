import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: File;
};

export type AdminLoginResponse = {
  __typename?: 'AdminLoginResponse';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  token: Scalars['String'];
};

export type AdminMeResponse = {
  __typename?: 'AdminMeResponse';
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type AdminSingleUserDetails = {
  __typename?: 'AdminSingleUserDetails';
  lessons: Array<LessonWithCounts>;
  user: AdminUserDetails;
};

export type AdminUserDetails = {
  __typename?: 'AdminUserDetails';
  _count?: Maybe<UserCount>;
  airlineId: Scalars['String'];
  avatar: Scalars['String'];
  certificate: Array<Certificate>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  emailSubscription: Scalars['Boolean'];
  enabled: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  lastNotification?: Maybe<Scalars['DateTime']>;
  lessonProgress: Array<LessonProgress>;
  ssoLogin?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['DateTime'];
};

export type Airline = {
  __typename?: 'Airline';
  _count?: Maybe<AirlineCount>;
  code: Scalars['String'];
  domain: Scalars['String'];
  enable: Scalars['Boolean'];
  id: Scalars['String'];
  title: Scalars['String'];
};

export type AirlineCount = {
  __typename?: 'AirlineCount';
  user: Scalars['Int'];
};

export type Certificate = {
  __typename?: 'Certificate';
  certificationId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type Certification = {
  __typename?: 'Certification';
  _count?: Maybe<CertificationCount>;
  certificateDetails: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  image: Scalars['String'];
  pdf: Scalars['String'];
  title: Scalars['String'];
};

export type CertificationCount = {
  __typename?: 'CertificationCount';
  certificate: Scalars['Int'];
  lesson: Scalars['Int'];
};

export type CourseCompletionRateResponse = {
  __typename?: 'CourseCompletionRateResponse';
  completions: Scalars['Float'];
  courseTitle: Scalars['String'];
};

export type CoursesDataResponse = {
  __typename?: 'CoursesDataResponse';
  coursesCompleted: Scalars['Float'];
  coursesNotCompleted: Scalars['Float'];
  coursesNotStarted: Scalars['Float'];
};

export type DashboardResponse = {
  __typename?: 'DashboardResponse';
  lessons: Scalars['Float'];
  notifications: Scalars['Float'];
  users: Scalars['Float'];
};

export type DisplayDataForSaveItem = {
  __typename?: 'DisplayDataForSaveItem';
  certificateId: Scalars['String'];
  footerText: Scalars['String'];
  heading: Scalars['String'];
  image: Scalars['String'];
  isCompleted: Scalars['Boolean'];
  lessonId: Scalars['String'];
  tag: Scalars['String'];
};

export type FullCertifiedDataResponse = {
  __typename?: 'FullCertifiedDataResponse';
  certifiedUsers: Scalars['Float'];
  totalUsers: Scalars['Float'];
  uncertifiedUsers: Scalars['Float'];
};

export type Lesson = {
  __typename?: 'Lesson';
  _count?: Maybe<LessonCount>;
  certificationDetails: Scalars['String'];
  certificationId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  image: Scalars['String'];
  lessonsSlides: Scalars['String'];
  plainTitle: Scalars['String'];
  quizSlides: Scalars['String'];
  successButtonText: Scalars['String'];
  successDescription: Scalars['String'];
  successTitle: Scalars['String'];
  tag: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type LessonCount = {
  __typename?: 'LessonCount';
  lessonProgress: Scalars['Int'];
  slides: Scalars['Int'];
};

export type LessonProgress = {
  __typename?: 'LessonProgress';
  completed: Scalars['Boolean'];
  completedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lessonId: Scalars['String'];
  progress: Scalars['Int'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type LessonProgressWithTotal = {
  __typename?: 'LessonProgressWithTotal';
  completed: Scalars['Boolean'];
  completedAt?: Maybe<Scalars['DateTime']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  lesson?: Maybe<Lesson>;
  lessonId: Scalars['String'];
  progress: Scalars['Int'];
  totalSlides: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type LessonWithCounts = {
  __typename?: 'LessonWithCounts';
  _count?: Maybe<LessonCount>;
  certificationDetails: Scalars['String'];
  certificationId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  image: Scalars['String'];
  lessonsSlides: Scalars['String'];
  plainTitle: Scalars['String'];
  quizSlides: Scalars['String'];
  slideCount: Scalars['Float'];
  successButtonText: Scalars['String'];
  successDescription: Scalars['String'];
  successTitle: Scalars['String'];
  tag: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type MediaContent = {
  __typename?: 'MediaContent';
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  name: Scalars['String'];
  publicURL?: Maybe<Scalars['String']>;
  size: Scalars['String'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToSave: Scalars['String'];
  adminChangePassword: AdminLoginResponse;
  adminCreate: Scalars['Boolean'];
  adminCreateBlankCourse: Lesson;
  adminCreateBlankSlide: Slides;
  adminCreateCertification: Scalars['Boolean'];
  adminCreateNotification: Scalars['Boolean'];
  adminDeleteCertification: Scalars['Boolean'];
  adminDeleteCourse: Scalars['Boolean'];
  adminRemoveSlide: Scalars['Boolean'];
  adminSignIn: AdminLoginResponse;
  adminUpdateCertification: Scalars['Boolean'];
  adminUpdateCourseCertificateDetails: Scalars['Boolean'];
  adminUpdateCourseDetails: Scalars['Boolean'];
  adminUpdateCourseLessonsDetails: Scalars['Boolean'];
  adminUpdateCourseStatus: Scalars['Boolean'];
  adminUpdateQuizLessonsDetails: Scalars['Boolean'];
  adminUpdateSlide: Slides;
  adminUpdateSuccessDetails: Scalars['Boolean'];
  adminUpdateUserStatus: User;
  createCertificate: Certificate;
  publicChangePassword: PublicChangePasswordResponse;
  publicDeleteAvatar: Scalars['Boolean'];
  publicForgotPassword: Scalars['Boolean'];
  publicLogin: PublicLoginResponse;
  publicLoginSSO: PublicLoginResponse;
  publicResendLoginOTP: PublicLoginResponse;
  publicResetPassword: Scalars['Boolean'];
  publicSignup: PublicLoginResponse;
  publicUploadAvatar: Scalars['String'];
  removeFromSave: Scalars['Boolean'];
  restartCourse: Scalars['Boolean'];
  restartLesson: Scalars['Boolean'];
  startLesson: Scalars['Boolean'];
  updateLessonProgress: Scalars['Boolean'];
  updateUserEmailSubscriptionStatus: Scalars['Boolean'];
  uploadMedia: Array<MediaContent>;
  verifyLoginOTP: PublicLoginResponse;
  verifySignupOTP: PublicLoginResponse;
};


export type MutationAddToSaveArgs = {
  itemId: Scalars['String'];
  itemType: SavedItemType;
};


export type MutationAdminChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationAdminCreateArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};


export type MutationAdminCreateBlankSlideArgs = {
  lessonId: Scalars['String'];
  swipeGroupValue: Scalars['Float'];
  templateKey: Scalars['String'];
  type: Scalars['String'];
};


export type MutationAdminCreateCertificationArgs = {
  certificateDetails: Scalars['String'];
  image: Scalars['String'];
  pdf: Scalars['String'];
  title: Scalars['String'];
};


export type MutationAdminCreateNotificationArgs = {
  description: Scalars['String'];
  notificationData: Scalars['String'];
  title: Scalars['String'];
  type: Scalars['String'];
};


export type MutationAdminDeleteCertificationArgs = {
  certificationId: Scalars['String'];
};


export type MutationAdminDeleteCourseArgs = {
  lessonId: Scalars['String'];
};


export type MutationAdminRemoveSlideArgs = {
  lessonId: Scalars['String'];
  slideId: Scalars['String'];
};


export type MutationAdminSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationAdminUpdateCertificationArgs = {
  certificateDetails: Scalars['String'];
  certificationId: Scalars['String'];
  image: Scalars['String'];
  pdf: Scalars['String'];
  title: Scalars['String'];
};


export type MutationAdminUpdateCourseCertificateDetailsArgs = {
  certificationDetails: Scalars['String'];
  lessonId: Scalars['String'];
};


export type MutationAdminUpdateCourseDetailsArgs = {
  certificationId: Scalars['String'];
  image: Scalars['String'];
  lessonId: Scalars['String'];
  plainTitle: Scalars['String'];
  tag: Scalars['String'];
  title: Scalars['String'];
};


export type MutationAdminUpdateCourseLessonsDetailsArgs = {
  lessonId: Scalars['String'];
  lessons: Scalars['String'];
};


export type MutationAdminUpdateCourseStatusArgs = {
  lessonId: Scalars['String'];
  status: Scalars['Boolean'];
};


export type MutationAdminUpdateQuizLessonsDetailsArgs = {
  lessonId: Scalars['String'];
  quizes: Scalars['String'];
};


export type MutationAdminUpdateSlideArgs = {
  data: Scalars['String'];
  slideId: Scalars['String'];
};


export type MutationAdminUpdateSuccessDetailsArgs = {
  lessonId: Scalars['String'];
  successButtonText: Scalars['String'];
  successDescription: Scalars['String'];
  successTitle: Scalars['String'];
};


export type MutationAdminUpdateUserStatusArgs = {
  status: Scalars['Boolean'];
  userId: Scalars['String'];
};


export type MutationCreateCertificateArgs = {
  lessonId: Scalars['String'];
};


export type MutationPublicChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationPublicForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationPublicLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPublicLoginSsoArgs = {
  email: Scalars['String'];
};


export type MutationPublicResendLoginOtpArgs = {
  OTPType: Scalars['String'];
  email: Scalars['String'];
};


export type MutationPublicResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationPublicSignupArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPublicUploadAvatarArgs = {
  file: Scalars['Upload'];
};


export type MutationRemoveFromSaveArgs = {
  saveId: Scalars['String'];
};


export type MutationRestartCourseArgs = {
  certificationId: Scalars['String'];
};


export type MutationRestartLessonArgs = {
  lessonId: Scalars['String'];
};


export type MutationStartLessonArgs = {
  lessonId: Scalars['String'];
};


export type MutationUpdateLessonProgressArgs = {
  isCompleted: Scalars['Boolean'];
  lessonProgressId: Scalars['String'];
  progress: Scalars['Float'];
};


export type MutationUpdateUserEmailSubscriptionStatusArgs = {
  email: Scalars['String'];
  status: Scalars['Boolean'];
};


export type MutationUploadMediaArgs = {
  fileNames?: InputMaybe<Array<Scalars['String']>>;
  files: Array<Scalars['Upload']>;
};


export type MutationVerifyLoginOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};


export type MutationVerifySignupOtpArgs = {
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  id: Scalars['String'];
  notificationData: Scalars['String'];
  title: Scalars['String'];
  type: NotificationType;
  updatedAt: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type PublicCertificateResponse = {
  __typename?: 'PublicCertificateResponse';
  certification: Certification;
  certificationId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type PublicCertificationByIdResponse = {
  __typename?: 'PublicCertificationByIdResponse';
  _count?: Maybe<CertificationCount>;
  certificate?: Maybe<Array<Certificate>>;
  certificateDetails: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  image: Scalars['String'];
  lesson?: Maybe<Array<PublicLessonProgressByIdResponse>>;
  pdf: Scalars['String'];
  title: Scalars['String'];
};

export type PublicCertificationResponse = {
  __typename?: 'PublicCertificationResponse';
  _count?: Maybe<CertificationCount>;
  certificate?: Maybe<Array<Certificate>>;
  certificateDetails: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  image: Scalars['String'];
  lesson?: Maybe<Array<PublicLessonProgressResponse>>;
  pdf: Scalars['String'];
  title: Scalars['String'];
};

export type PublicChangePasswordResponse = {
  __typename?: 'PublicChangePasswordResponse';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  token: Scalars['String'];
};

export type PublicLessonProgressByIdResponse = {
  __typename?: 'PublicLessonProgressByIdResponse';
  _count?: Maybe<LessonCount>;
  certificationDetails: Scalars['String'];
  certificationId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  image: Scalars['String'];
  lessonProgress?: Maybe<Array<LessonProgress>>;
  lessonsSlides: Scalars['String'];
  plainTitle: Scalars['String'];
  quizSlides: Scalars['String'];
  successButtonText: Scalars['String'];
  successDescription: Scalars['String'];
  successTitle: Scalars['String'];
  tag: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PublicLessonProgressResponse = {
  __typename?: 'PublicLessonProgressResponse';
  _count?: Maybe<LessonCount>;
  certificationDetails: Scalars['String'];
  certificationId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  image: Scalars['String'];
  lessonProgress?: Maybe<Array<LessonProgress>>;
  lessonsSlides: Scalars['String'];
  plainTitle: Scalars['String'];
  quizSlides: Scalars['String'];
  successButtonText: Scalars['String'];
  successDescription: Scalars['String'];
  successTitle: Scalars['String'];
  tag: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type PublicLoginResponse = {
  __typename?: 'PublicLoginResponse';
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  message: Scalars['String'];
  token?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  adminDashboard: DashboardResponse;
  adminGetAllCertifications: Array<Certification>;
  adminGetAllCourse: Array<Lesson>;
  adminGetAllNotifications: Array<Notification>;
  adminGetAllUsers: Array<User>;
  adminGetCertificationById: Certification;
  adminGetCourse: Lesson;
  adminGetSlides: Array<Slides>;
  adminGetUser: AdminSingleUserDetails;
  adminMe: AdminMeResponse;
  getActiveUsers: UsersDataResponseWithTotal;
  getAllAirlines: Array<Airline>;
  getAllLessonProgress: Array<LessonProgressWithTotal>;
  getAllLessons: Array<Lesson>;
  getAllNotifications: Array<Notification>;
  getAndUpdateUserNotificationLastSeen: Scalars['DateTime'];
  getCertificates: Array<PublicCertificateResponse>;
  getCertificatesById: PublicCertificateResponse;
  getCourseCompletionReport: Array<CourseCompletionRateResponse>;
  getCourseUpdateNotification: Array<Notification>;
  getCoursesReportData: CoursesDataResponse;
  getFullyCertifiedData: FullCertifiedDataResponse;
  getLessonProgress: LessonProgressWithTotal;
  getLessonSlides: Array<Slides>;
  getNewSignups: Array<UsersDataResponse>;
  getQuizSlides: Array<Slides>;
  getReminderNotification: Array<Notification>;
  getSystemNotification: Array<Notification>;
  getUserNotificationLastSeen: Scalars['DateTime'];
  getUserSavedItems: Array<UserSaveItemResponse>;
  listMedia: Array<MediaContent>;
  publicGetAllCertifications: Array<PublicCertificationResponse>;
  publicGetCertificationById: PublicCertificationByIdResponse;
  test: Scalars['String'];
  userMe: UserMeResponse;
};


export type QueryAdminGetCertificationByIdArgs = {
  certificationId: Scalars['String'];
};


export type QueryAdminGetCourseArgs = {
  lessonId: Scalars['String'];
};


export type QueryAdminGetSlidesArgs = {
  slidesIds: Array<Scalars['String']>;
};


export type QueryAdminGetUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetActiveUsersArgs = {
  airlineId?: InputMaybe<Scalars['String']>;
  filter: Scalars['String'];
};


export type QueryGetCertificatesByIdArgs = {
  certificateId: Scalars['String'];
};


export type QueryGetCourseCompletionReportArgs = {
  airlineId?: InputMaybe<Scalars['String']>;
};


export type QueryGetCoursesReportDataArgs = {
  airlineId?: InputMaybe<Scalars['String']>;
  lessonId?: InputMaybe<Scalars['String']>;
};


export type QueryGetFullyCertifiedDataArgs = {
  airlineId?: InputMaybe<Scalars['String']>;
};


export type QueryGetLessonProgressArgs = {
  lessonId: Scalars['String'];
};


export type QueryGetLessonSlidesArgs = {
  lessonId: Scalars['String'];
};


export type QueryGetNewSignupsArgs = {
  airlineId?: InputMaybe<Scalars['String']>;
  filter: Scalars['String'];
};


export type QueryGetQuizSlidesArgs = {
  lessonId: Scalars['String'];
};


export type QueryPublicGetCertificationByIdArgs = {
  certificationId: Scalars['String'];
};

export type Slides = {
  __typename?: 'Slides';
  createdAt: Scalars['DateTime'];
  data: Scalars['String'];
  id: Scalars['String'];
  lessonId: Scalars['String'];
  templateKey: Scalars['String'];
  type: SlideType;
  updatedAt: Scalars['DateTime'];
};

export type User = {
  __typename?: 'User';
  _count?: Maybe<UserCount>;
  airlineId: Scalars['String'];
  avatar: Scalars['String'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  emailSubscription: Scalars['Boolean'];
  enabled: Scalars['Boolean'];
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  lastNotification?: Maybe<Scalars['DateTime']>;
  ssoLogin?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['DateTime'];
};

export type UserCount = {
  __typename?: 'UserCount';
  certificate: Scalars['Int'];
  lessonProgress: Scalars['Int'];
  notification: Scalars['Int'];
  savedItems: Scalars['Int'];
};

export type UserMeResponse = {
  __typename?: 'UserMeResponse';
  airline?: Maybe<Scalars['String']>;
  avatar: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type UserSaveItemResponse = {
  __typename?: 'UserSaveItemResponse';
  createdAt: Scalars['DateTime'];
  displayData: DisplayDataForSaveItem;
  id: Scalars['String'];
  savedItemKey: Scalars['String'];
  type: SavedItemType;
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type UsersDataResponse = {
  __typename?: 'UsersDataResponse';
  date?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['Float']>;
  startDate?: Maybe<Scalars['String']>;
  value: Scalars['Float'];
};

export type UsersDataResponseWithTotal = {
  __typename?: 'UsersDataResponseWithTotal';
  graphData: Array<UsersDataResponse>;
  totalActiveUsers: Scalars['Float'];
};

export enum NotificationType {
  LessonUpdate = 'LESSON_UPDATE',
  Reminder = 'REMINDER',
  SystemUpdate = 'SYSTEM_UPDATE'
}

export enum SavedItemType {
  Course = 'COURSE',
  Slide = 'SLIDE'
}

export enum SlideType {
  Lessons = 'LESSONS',
  Quiz = 'QUIZ'
}

export type AdminSignInMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type AdminSignInMutation = { __typename?: 'Mutation', adminSignIn: { __typename?: 'AdminLoginResponse', token: string, firstName: string, lastName: string } };

export type AdminGetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetAllUsersQuery = { __typename?: 'Query', adminGetAllUsers: Array<{ __typename?: 'User', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, createdAt: any, updatedAt: any }> };

export type AdminGetUserQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type AdminGetUserQuery = { __typename?: 'Query', adminGetUser: { __typename?: 'AdminSingleUserDetails', user: { __typename?: 'AdminUserDetails', id: string, firstName: string, lastName: string, email: string, avatar: string, enabled: boolean, createdAt: any, updatedAt: any, lessonProgress: Array<{ __typename?: 'LessonProgress', id: string, lessonId: string, progress: number, completed: boolean, completedAt?: any | null }>, certificate: Array<{ __typename?: 'Certificate', id: string, certificationId: string, createdAt: any, updatedAt: any }> }, lessons: Array<{ __typename?: 'LessonWithCounts', id: string, title: string, certificationId?: string | null, certificationDetails: string, image: string, tag: string, enabled: boolean, createdAt: any, updatedAt: any, slideCount: number }> } };

export type AdminUpdateUserStatusMutationVariables = Exact<{
  userId: Scalars['String'];
  status: Scalars['Boolean'];
}>;


export type AdminUpdateUserStatusMutation = { __typename?: 'Mutation', adminUpdateUserStatus: { __typename?: 'User', enabled: boolean } };

export type AdminCreateNotificationMutationVariables = Exact<{
  title: Scalars['String'];
  description: Scalars['String'];
  type: Scalars['String'];
  notificationData: Scalars['String'];
}>;


export type AdminCreateNotificationMutation = { __typename?: 'Mutation', adminCreateNotification: boolean };

export type AdminGetAllNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetAllNotificationsQuery = { __typename?: 'Query', adminGetAllNotifications: Array<{ __typename?: 'Notification', id: string, title: string, description: string, type: NotificationType, notificationData: string, createdAt: any, updatedAt: any }> };

export type AdminDashboardQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminDashboardQuery = { __typename?: 'Query', adminDashboard: { __typename?: 'DashboardResponse', lessons: number, users: number, notifications: number } };

export type AdminGetAllCourseQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetAllCourseQuery = { __typename?: 'Query', adminGetAllCourse: Array<{ __typename?: 'Lesson', id: string, title: string, image: string, tag: string, enabled: boolean, createdAt: any, updatedAt: any }> };

export type AdminGetCourseQueryVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type AdminGetCourseQuery = { __typename?: 'Query', adminGetCourse: { __typename?: 'Lesson', id: string, title: string, certificationDetails: string, image: string, tag: string, lessonsSlides: string, quizSlides: string, enabled: boolean, successTitle: string, successDescription: string, successButtonText: string, createdAt: any, updatedAt: any, certificationId?: string | null } };

export type AdminCreateBlankCourseMutationVariables = Exact<{ [key: string]: never; }>;


export type AdminCreateBlankCourseMutation = { __typename?: 'Mutation', adminCreateBlankCourse: { __typename?: 'Lesson', id: string } };

export type AdminUpdateCourseDetailsMutationVariables = Exact<{
  title: Scalars['String'];
  plainTitle: Scalars['String'];
  tag: Scalars['String'];
  image: Scalars['String'];
  lessonId: Scalars['String'];
  certificationId: Scalars['String'];
}>;


export type AdminUpdateCourseDetailsMutation = { __typename?: 'Mutation', adminUpdateCourseDetails: boolean };

export type AdminUpdateSuccessDetailsMutationVariables = Exact<{
  successButtonText: Scalars['String'];
  successDescription: Scalars['String'];
  successTitle: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type AdminUpdateSuccessDetailsMutation = { __typename?: 'Mutation', adminUpdateSuccessDetails: boolean };

export type AdminUpdateCourseCertificateDetailsMutationVariables = Exact<{
  certificationDetails: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type AdminUpdateCourseCertificateDetailsMutation = { __typename?: 'Mutation', adminUpdateCourseCertificateDetails: boolean };

export type AdminCreateBlankSlideMutationVariables = Exact<{
  type: Scalars['String'];
  templateKey: Scalars['String'];
  lessonId: Scalars['String'];
  swipeGroupValue: Scalars['Float'];
}>;


export type AdminCreateBlankSlideMutation = { __typename?: 'Mutation', adminCreateBlankSlide: { __typename?: 'Slides', id: string, data: string, templateKey: string, type: SlideType, createdAt: any, updatedAt: any, lessonId: string } };

export type AdminUpdateCourseLessonsDetailsMutationVariables = Exact<{
  lessons: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type AdminUpdateCourseLessonsDetailsMutation = { __typename?: 'Mutation', adminUpdateCourseLessonsDetails: boolean };

export type AdminUpdateQuizLessonsDetailsMutationVariables = Exact<{
  quizes: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type AdminUpdateQuizLessonsDetailsMutation = { __typename?: 'Mutation', adminUpdateQuizLessonsDetails: boolean };

export type AdminGetSlidesQueryVariables = Exact<{
  slidesIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type AdminGetSlidesQuery = { __typename?: 'Query', adminGetSlides: Array<{ __typename?: 'Slides', id: string, data: string, templateKey: string, type: SlideType, createdAt: any, updatedAt: any, lessonId: string }> };

export type AdminUpdateSlideMutationVariables = Exact<{
  slideId: Scalars['String'];
  data: Scalars['String'];
}>;


export type AdminUpdateSlideMutation = { __typename?: 'Mutation', adminUpdateSlide: { __typename?: 'Slides', id: string, data: string, templateKey: string, type: SlideType, createdAt: any, updatedAt: any, lessonId: string } };

export type AdminUploadMediaMutationVariables = Exact<{
  files: Array<Scalars['Upload']> | Scalars['Upload'];
}>;


export type AdminUploadMediaMutation = { __typename?: 'Mutation', uploadMedia: Array<{ __typename?: 'MediaContent', id: string, publicURL?: string | null, size: string, type: string, name: string, createdBy: string, createdAt: any, enabled: boolean }> };

export type AdminDeleteSlideMutationVariables = Exact<{
  lessonId: Scalars['String'];
  slideId: Scalars['String'];
}>;


export type AdminDeleteSlideMutation = { __typename?: 'Mutation', adminRemoveSlide: boolean };

export type AdminUpdateCourseStatusMutationVariables = Exact<{
  lessonId: Scalars['String'];
  status: Scalars['Boolean'];
}>;


export type AdminUpdateCourseStatusMutation = { __typename?: 'Mutation', adminUpdateCourseStatus: boolean };

export type ReportActiveUsersQueryVariables = Exact<{
  airlineId: Scalars['String'];
  filter: Scalars['String'];
}>;


export type ReportActiveUsersQuery = { __typename?: 'Query', getActiveUsers: { __typename?: 'UsersDataResponseWithTotal', totalActiveUsers: number, graphData: Array<{ __typename?: 'UsersDataResponse', date?: string | null, month?: number | null, startDate?: string | null, endDate?: string | null, value: number }> } };

export type GetNewSignupsQueryVariables = Exact<{
  airlineId: Scalars['String'];
  filter: Scalars['String'];
}>;


export type GetNewSignupsQuery = { __typename?: 'Query', getNewSignups: Array<{ __typename?: 'UsersDataResponse', date?: string | null, month?: number | null, startDate?: string | null, endDate?: string | null, value: number }> };

export type GetFullyCertifiedDataQueryVariables = Exact<{
  airlineId: Scalars['String'];
}>;


export type GetFullyCertifiedDataQuery = { __typename?: 'Query', getFullyCertifiedData: { __typename?: 'FullCertifiedDataResponse', totalUsers: number, certifiedUsers: number, uncertifiedUsers: number } };

export type GetCoursesReportDataQueryVariables = Exact<{
  airlineId: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type GetCoursesReportDataQuery = { __typename?: 'Query', getCoursesReportData: { __typename?: 'CoursesDataResponse', coursesNotStarted: number, coursesNotCompleted: number, coursesCompleted: number } };

export type GetCourseCompletionReportQueryVariables = Exact<{
  airlineId: Scalars['String'];
}>;


export type GetCourseCompletionReportQuery = { __typename?: 'Query', getCourseCompletionReport: Array<{ __typename?: 'CourseCompletionRateResponse', courseTitle: string, completions: number }> };

export type AdminGetAllCertificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetAllCertificationsQuery = { __typename?: 'Query', adminGetAllCertifications: Array<{ __typename?: 'Certification', id: string, title: string, image: string, pdf: string, certificateDetails: string, createdAt: any }> };

export type AdminGetCertificationByIdQueryVariables = Exact<{
  certificationId: Scalars['String'];
}>;


export type AdminGetCertificationByIdQuery = { __typename?: 'Query', adminGetCertificationById: { __typename?: 'Certification', id: string, title: string, image: string, pdf: string, certificateDetails: string, createdAt: any } };

export type CreateCertificationsMutationVariables = Exact<{
  image: Scalars['String'];
  pdf: Scalars['String'];
  title: Scalars['String'];
  certificateDetails: Scalars['String'];
}>;


export type CreateCertificationsMutation = { __typename?: 'Mutation', adminCreateCertification: boolean };

export type UpdateCertificationMutationVariables = Exact<{
  image: Scalars['String'];
  title: Scalars['String'];
  pdf: Scalars['String'];
  certificationId: Scalars['String'];
  certificateDetails: Scalars['String'];
}>;


export type UpdateCertificationMutation = { __typename?: 'Mutation', adminUpdateCertification: boolean };

export type DeleteCertificationMutationVariables = Exact<{
  certificationId: Scalars['String'];
}>;


export type DeleteCertificationMutation = { __typename?: 'Mutation', adminDeleteCertification: boolean };

export type GetAllAirlinesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllAirlinesQuery = { __typename?: 'Query', getAllAirlines: Array<{ __typename?: 'Airline', id: string, title: string, domain: string, enable: boolean, _count?: { __typename?: 'AirlineCount', user: number } | null }> };

export type LandingDetailsQueryVariables = Exact<{
  airlineId: Scalars['String'];
  activeUsersFilter: Scalars['String'];
  newSignUpFilter: Scalars['String'];
  lessonId: Scalars['String'];
}>;


export type LandingDetailsQuery = { __typename?: 'Query', getActiveUsers: { __typename?: 'UsersDataResponseWithTotal', totalActiveUsers: number, graphData: Array<{ __typename?: 'UsersDataResponse', date?: string | null, month?: number | null, startDate?: string | null, endDate?: string | null, value: number }> }, getNewSignups: Array<{ __typename?: 'UsersDataResponse', date?: string | null, month?: number | null, startDate?: string | null, endDate?: string | null, value: number }>, getFullyCertifiedData: { __typename?: 'FullCertifiedDataResponse', totalUsers: number, certifiedUsers: number, uncertifiedUsers: number }, getCoursesReportData: { __typename?: 'CoursesDataResponse', coursesNotStarted: number, coursesNotCompleted: number, coursesCompleted: number }, getCourseCompletionReport: Array<{ __typename?: 'CourseCompletionRateResponse', courseTitle: string, completions: number }> };

export type AdminDeleteCourseMutationVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type AdminDeleteCourseMutation = { __typename?: 'Mutation', adminDeleteCourse: boolean };

export type ListMediaQueryVariables = Exact<{ [key: string]: never; }>;


export type ListMediaQuery = { __typename?: 'Query', listMedia: Array<{ __typename?: 'MediaContent', id: string, publicURL?: string | null, size: string, type: string, name: string, enabled: boolean, createdBy: string, createdAt: any }> };

export type AdminChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type AdminChangePasswordMutation = { __typename?: 'Mutation', adminChangePassword: { __typename?: 'AdminLoginResponse', token: string, firstName: string, lastName: string } };

export type AdminMeQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminMeQuery = { __typename?: 'Query', adminMe: { __typename?: 'AdminMeResponse', firstName: string, lastName: string, email: string } };

export type PublicLoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type PublicLoginMutation = { __typename?: 'Mutation', publicLogin: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicLoginSsoMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type PublicLoginSsoMutation = { __typename?: 'Mutation', publicLoginSSO: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type PublicForgotPasswordMutation = { __typename?: 'Mutation', publicForgotPassword: boolean };

export type PublicResetPasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type PublicResetPasswordMutation = { __typename?: 'Mutation', publicResetPassword: boolean };

export type PublicSignupMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type PublicSignupMutation = { __typename?: 'Mutation', publicSignup: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type PublicResendLoginOtpMutationVariables = Exact<{
  email: Scalars['String'];
  OTPType: Scalars['String'];
}>;


export type PublicResendLoginOtpMutation = { __typename?: 'Mutation', publicResendLoginOTP: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type VerifySignupOtpMutationVariables = Exact<{
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
}>;


export type VerifySignupOtpMutation = { __typename?: 'Mutation', verifySignupOTP: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type VerifyLoginOtpMutationVariables = Exact<{
  email: Scalars['String'];
  otp: Scalars['String'];
  rememberMe: Scalars['Boolean'];
}>;


export type VerifyLoginOtpMutation = { __typename?: 'Mutation', verifyLoginOTP: { __typename?: 'PublicLoginResponse', id?: string | null, token?: string | null, firstName?: string | null, lastName?: string | null, message: string } };

export type UpdateUserEmailSubscriptionStatusMutationVariables = Exact<{
  email: Scalars['String'];
  status: Scalars['Boolean'];
}>;


export type UpdateUserEmailSubscriptionStatusMutation = { __typename?: 'Mutation', updateUserEmailSubscriptionStatus: boolean };

export type GetCertificatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCertificatesQuery = { __typename?: 'Query', getCertificates: Array<{ __typename?: 'PublicCertificateResponse', id: string, userId: string, createdAt: any, updatedAt: any, certification: { __typename?: 'Certification', id: string, title: string, image: string, pdf: string, certificateDetails: string } }> };

export type GetCertificateByIdQueryVariables = Exact<{
  certificateId: Scalars['String'];
}>;


export type GetCertificateByIdQuery = { __typename?: 'Query', getCertificatesById: { __typename?: 'PublicCertificateResponse', id: string, userId: string, createdAt: any, updatedAt: any, certification: { __typename?: 'Certification', id: string, title: string, image: string, pdf: string, certificateDetails: string } } };

export type CreateCertificateMutationVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type CreateCertificateMutation = { __typename?: 'Mutation', createCertificate: { __typename?: 'Certificate', id: string, userId: string, createdAt: any, updatedAt: any, certificationId: string } };

export type PublicGetAllCertificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type PublicGetAllCertificationsQuery = { __typename?: 'Query', publicGetAllCertifications: Array<{ __typename?: 'PublicCertificationResponse', id: string, title: string, image: string, pdf: string, certificateDetails: string, createdAt: any, lesson?: Array<{ __typename?: 'PublicLessonProgressResponse', id: string, enabled: boolean, lessonProgress?: Array<{ __typename?: 'LessonProgress', id: string, userId: string, lessonId: string, progress: number, completedAt?: any | null, completed: boolean, createdAt: any, updatedAt: any }> | null }> | null, certificate?: Array<{ __typename?: 'Certificate', id: string }> | null }> };

export type PublicGetCertificationByIdQueryVariables = Exact<{
  certificationId: Scalars['String'];
}>;


export type PublicGetCertificationByIdQuery = { __typename?: 'Query', publicGetCertificationById: { __typename?: 'PublicCertificationByIdResponse', id: string, title: string, image: string, pdf: string, certificateDetails: string, createdAt: any, lesson?: Array<{ __typename?: 'PublicLessonProgressByIdResponse', id: string, title: string, image: string, tag: string, certificationId?: string | null, lessonProgress?: Array<{ __typename?: 'LessonProgress', id: string, userId: string, lessonId: string, progress: number, completedAt?: any | null, completed: boolean, createdAt: any, updatedAt: any }> | null }> | null, certificate?: Array<{ __typename?: 'Certificate', id: string }> | null } };

export type GetLessonSlidesQueryVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type GetLessonSlidesQuery = { __typename?: 'Query', getLessonSlides: Array<{ __typename?: 'Slides', id: string, data: string, templateKey: string, type: SlideType, createdAt: any, updatedAt: any, lessonId: string }> };

export type GetQuizSlidesQueryVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type GetQuizSlidesQuery = { __typename?: 'Query', getQuizSlides: Array<{ __typename?: 'Slides', id: string, data: string, templateKey: string, type: SlideType, createdAt: any, updatedAt: any, lessonId: string }> };

export type GetAllLessonProgressQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLessonProgressQuery = { __typename?: 'Query', getAllLessonProgress: Array<{ __typename?: 'LessonProgressWithTotal', id: string, userId: string, lessonId: string, progress: number, totalSlides: number, completedAt?: any | null, completed: boolean, createdAt: any, updatedAt: any, lesson?: { __typename?: 'Lesson', id: string, title: string, certificationDetails: string, image: string, tag: string, lessonsSlides: string, quizSlides: string, enabled: boolean, createdAt: any, updatedAt: any, successTitle: string, successDescription: string, successButtonText: string } | null }> };

export type GetLessonProgressQueryVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type GetLessonProgressQuery = { __typename?: 'Query', getLessonProgress: { __typename?: 'LessonProgressWithTotal', id: string, userId: string, lessonId: string, progress: number, totalSlides: number, completedAt?: any | null, completed: boolean, createdAt: any, updatedAt: any, lesson?: { __typename?: 'Lesson', id: string, title: string, certificationDetails: string, image: string, tag: string, lessonsSlides: string, quizSlides: string, enabled: boolean, createdAt: any, updatedAt: any, successTitle: string, successDescription: string, successButtonText: string } | null } };

export type UpdateLessonProgressMutationVariables = Exact<{
  isCompleted: Scalars['Boolean'];
  progress: Scalars['Float'];
  lessonProgressId: Scalars['String'];
}>;


export type UpdateLessonProgressMutation = { __typename?: 'Mutation', updateLessonProgress: boolean };

export type GetAllLessonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllLessonsQuery = { __typename?: 'Query', getAllLessons: Array<{ __typename?: 'Lesson', id: string, title: string, certificationDetails: string, image: string, tag: string, lessonsSlides: string, quizSlides: string, enabled: boolean, createdAt: any, updatedAt: any }> };

export type StartLessonMutationVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type StartLessonMutation = { __typename?: 'Mutation', startLesson: boolean };

export type RestartLessonMutationVariables = Exact<{
  lessonId: Scalars['String'];
}>;


export type RestartLessonMutation = { __typename?: 'Mutation', restartLesson: boolean };

export type RestartCourseMutationVariables = Exact<{
  certificationId: Scalars['String'];
}>;


export type RestartCourseMutation = { __typename?: 'Mutation', restartCourse: boolean };

export type UserMeQueryVariables = Exact<{ [key: string]: never; }>;


export type UserMeQuery = { __typename?: 'Query', userMe: { __typename?: 'UserMeResponse', firstName: string, lastName: string, email: string, avatar: string, airline?: string | null } };

export type PublicChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type PublicChangePasswordMutation = { __typename?: 'Mutation', publicChangePassword: { __typename?: 'PublicChangePasswordResponse', token: string, firstName: string, lastName: string } };

export type PublicUploadAvatarMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type PublicUploadAvatarMutation = { __typename?: 'Mutation', publicUploadAvatar: string };

export type PublicDeleteAvatarMutationVariables = Exact<{ [key: string]: never; }>;


export type PublicDeleteAvatarMutation = { __typename?: 'Mutation', publicDeleteAvatar: boolean };

export type GetUserSavedItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSavedItemsQuery = { __typename?: 'Query', getUserSavedItems: Array<{ __typename?: 'UserSaveItemResponse', id: string, savedItemKey: string, type: SavedItemType, userId: string, createdAt: any, updatedAt: any, displayData: { __typename?: 'DisplayDataForSaveItem', heading: string, tag: string, footerText: string, image: string, isCompleted: boolean, lessonId: string, certificateId: string } }> };

export type UserAddToSaveMutationVariables = Exact<{
  itemId: Scalars['String'];
  itemType: SavedItemType;
}>;


export type UserAddToSaveMutation = { __typename?: 'Mutation', addToSave: string };

export type UserRemoveFromSaveMutationVariables = Exact<{
  savedId: Scalars['String'];
}>;


export type UserRemoveFromSaveMutation = { __typename?: 'Mutation', removeFromSave: boolean };

export type GetCourseUpdateNotificationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCourseUpdateNotificationQuery = { __typename?: 'Query', getCourseUpdateNotification: Array<{ __typename?: 'Notification', id: string, title: string, description: string, type: NotificationType, notificationData: string, createdAt: any, updatedAt: any, userId?: string | null }> };

export type GetReminderNotificationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetReminderNotificationQuery = { __typename?: 'Query', getReminderNotification: Array<{ __typename?: 'Notification', id: string, title: string, description: string, type: NotificationType, notificationData: string, createdAt: any, updatedAt: any, userId?: string | null }> };

export type GetSystemNotificationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemNotificationQuery = { __typename?: 'Query', getSystemNotification: Array<{ __typename?: 'Notification', id: string, title: string, description: string, type: NotificationType, notificationData: string, createdAt: any, updatedAt: any, userId?: string | null }> };

export type GetAllNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllNotificationsQuery = { __typename?: 'Query', getAllNotifications: Array<{ __typename?: 'Notification', id: string, title: string, description: string, type: NotificationType, notificationData: string, createdAt: any, updatedAt: any, userId?: string | null }> };

export type GetAndUpdateUserNotificationLastSeenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAndUpdateUserNotificationLastSeenQuery = { __typename?: 'Query', getAndUpdateUserNotificationLastSeen: any };

export type GetUserNotificationLastSeenQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserNotificationLastSeenQuery = { __typename?: 'Query', getUserNotificationLastSeen: any };

export type TestQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQuery = { __typename?: 'Query', test: string };


export const AdminSignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminSignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminSignIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AdminSignInMutation, AdminSignInMutationVariables>;
export const AdminGetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetAllUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetAllUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AdminGetAllUsersQuery, AdminGetAllUsersQueryVariables>;
export const AdminGetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certificationId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"certificationId"}},{"kind":"Field","name":{"kind":"Name","value":"certificationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"slideCount"}}]}}]}}]}}]} as unknown as DocumentNode<AdminGetUserQuery, AdminGetUserQueryVariables>;
export const AdminUpdateUserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateUserStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateUserStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<AdminUpdateUserStatusMutation, AdminUpdateUserStatusMutationVariables>;
export const AdminCreateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminCreateNotification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notificationData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCreateNotification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"notificationData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notificationData"}}}]}]}}]} as unknown as DocumentNode<AdminCreateNotificationMutation, AdminCreateNotificationMutationVariables>;
export const AdminGetAllNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notificationData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AdminGetAllNotificationsQuery, AdminGetAllNotificationsQueryVariables>;
export const AdminDashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminDashboard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lessons"}},{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}}]}}]}}]} as unknown as DocumentNode<AdminDashboardQuery, AdminDashboardQueryVariables>;
export const AdminGetAllCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetAllCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetAllCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<AdminGetAllCourseQuery, AdminGetAllCourseQueryVariables>;
export const AdminGetCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"certificationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"lessonsSlides"}},{"kind":"Field","name":{"kind":"Name","value":"quizSlides"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"successTitle"}},{"kind":"Field","name":{"kind":"Name","value":"successDescription"}},{"kind":"Field","name":{"kind":"Name","value":"successButtonText"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"certificationId"}}]}}]}}]} as unknown as DocumentNode<AdminGetCourseQuery, AdminGetCourseQueryVariables>;
export const AdminCreateBlankCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminCreateBlankCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCreateBlankCourse"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AdminCreateBlankCourseMutation, AdminCreateBlankCourseMutationVariables>;
export const AdminUpdateCourseDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateCourseDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plainTitle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateCourseDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"plainTitle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plainTitle"}}},{"kind":"Argument","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"certificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}}}]}]}}]} as unknown as DocumentNode<AdminUpdateCourseDetailsMutation, AdminUpdateCourseDetailsMutationVariables>;
export const AdminUpdateSuccessDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateSuccessDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"successButtonText"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"successDescription"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"successTitle"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateSuccessDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"successButtonText"},"value":{"kind":"Variable","name":{"kind":"Name","value":"successButtonText"}}},{"kind":"Argument","name":{"kind":"Name","value":"successDescription"},"value":{"kind":"Variable","name":{"kind":"Name","value":"successDescription"}}},{"kind":"Argument","name":{"kind":"Name","value":"successTitle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"successTitle"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<AdminUpdateSuccessDetailsMutation, AdminUpdateSuccessDetailsMutationVariables>;
export const AdminUpdateCourseCertificateDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateCourseCertificateDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationDetails"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateCourseCertificateDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificationDetails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationDetails"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<AdminUpdateCourseCertificateDetailsMutation, AdminUpdateCourseCertificateDetailsMutationVariables>;
export const AdminCreateBlankSlideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminCreateBlankSlide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"templateKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"swipeGroupValue"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCreateBlankSlide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"templateKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"templateKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"swipeGroupValue"},"value":{"kind":"Variable","name":{"kind":"Name","value":"swipeGroupValue"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"templateKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}}]}}]} as unknown as DocumentNode<AdminCreateBlankSlideMutation, AdminCreateBlankSlideMutationVariables>;
export const AdminUpdateCourseLessonsDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateCourseLessonsDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessons"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateCourseLessonsDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessons"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessons"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<AdminUpdateCourseLessonsDetailsMutation, AdminUpdateCourseLessonsDetailsMutationVariables>;
export const AdminUpdateQuizLessonsDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateQuizLessonsDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"quizes"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateQuizLessonsDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"quizes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"quizes"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<AdminUpdateQuizLessonsDetailsMutation, AdminUpdateQuizLessonsDetailsMutationVariables>;
export const AdminGetSlidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetSlides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slidesIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetSlides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slidesIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slidesIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"templateKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}}]}}]} as unknown as DocumentNode<AdminGetSlidesQuery, AdminGetSlidesQueryVariables>;
export const AdminUpdateSlideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateSlide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slideId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateSlide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slideId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slideId"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"templateKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}}]}}]} as unknown as DocumentNode<AdminUpdateSlideMutation, AdminUpdateSlideMutationVariables>;
export const AdminUploadMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUploadMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"files"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"files"},"value":{"kind":"Variable","name":{"kind":"Name","value":"files"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"publicURL"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<AdminUploadMediaMutation, AdminUploadMediaMutationVariables>;
export const AdminDeleteSlideDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminDeleteSlide"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slideId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminRemoveSlide"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"slideId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slideId"}}}]}]}}]} as unknown as DocumentNode<AdminDeleteSlideMutation, AdminDeleteSlideMutationVariables>;
export const AdminUpdateCourseStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminUpdateCourseStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateCourseStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}]}}]} as unknown as DocumentNode<AdminUpdateCourseStatusMutation, AdminUpdateCourseStatusMutationVariables>;
export const ReportActiveUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reportActiveUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalActiveUsers"}},{"kind":"Field","name":{"kind":"Name","value":"graphData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<ReportActiveUsersQuery, ReportActiveUsersQueryVariables>;
export const GetNewSignupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getNewSignups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getNewSignups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<GetNewSignupsQuery, GetNewSignupsQueryVariables>;
export const GetFullyCertifiedDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getFullyCertifiedData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getFullyCertifiedData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"certifiedUsers"}},{"kind":"Field","name":{"kind":"Name","value":"uncertifiedUsers"}}]}}]}}]} as unknown as DocumentNode<GetFullyCertifiedDataQuery, GetFullyCertifiedDataQueryVariables>;
export const GetCoursesReportDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCoursesReportData"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCoursesReportData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coursesNotStarted"}},{"kind":"Field","name":{"kind":"Name","value":"coursesNotCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCompleted"}}]}}]}}]} as unknown as DocumentNode<GetCoursesReportDataQuery, GetCoursesReportDataQueryVariables>;
export const GetCourseCompletionReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCourseCompletionReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseCompletionReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseTitle"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}}]}}]}}]} as unknown as DocumentNode<GetCourseCompletionReportQuery, GetCourseCompletionReportQueryVariables>;
export const AdminGetAllCertificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetAllCertifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetAllCertifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"}},{"kind":"Field","name":{"kind":"Name","value":"certificateDetails"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AdminGetAllCertificationsQuery, AdminGetAllCertificationsQueryVariables>;
export const AdminGetCertificationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminGetCertificationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminGetCertificationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"}},{"kind":"Field","name":{"kind":"Name","value":"certificateDetails"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<AdminGetCertificationByIdQuery, AdminGetCertificationByIdQueryVariables>;
export const CreateCertificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCertifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pdf"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificateDetails"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminCreateCertification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"pdf"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pdf"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"certificateDetails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificateDetails"}}}]}]}}]} as unknown as DocumentNode<CreateCertificationsMutation, CreateCertificationsMutationVariables>;
export const UpdateCertificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCertification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"image"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pdf"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificateDetails"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminUpdateCertification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"image"},"value":{"kind":"Variable","name":{"kind":"Name","value":"image"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"pdf"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pdf"}}},{"kind":"Argument","name":{"kind":"Name","value":"certificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"certificateDetails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificateDetails"}}}]}]}}]} as unknown as DocumentNode<UpdateCertificationMutation, UpdateCertificationMutationVariables>;
export const DeleteCertificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCertification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminDeleteCertification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}}}]}]}}]} as unknown as DocumentNode<DeleteCertificationMutation, DeleteCertificationMutationVariables>;
export const GetAllAirlinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllAirlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllAirlines"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"enable"}},{"kind":"Field","name":{"kind":"Name","value":"_count"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllAirlinesQuery, GetAllAirlinesQueryVariables>;
export const LandingDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"landingDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activeUsersFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newSignUpFilter"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getActiveUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activeUsersFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalActiveUsers"}},{"kind":"Field","name":{"kind":"Name","value":"graphData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getNewSignups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newSignUpFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getFullyCertifiedData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}},{"kind":"Field","name":{"kind":"Name","value":"certifiedUsers"}},{"kind":"Field","name":{"kind":"Name","value":"uncertifiedUsers"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getCoursesReportData"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coursesNotStarted"}},{"kind":"Field","name":{"kind":"Name","value":"coursesNotCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"coursesCompleted"}}]}},{"kind":"Field","name":{"kind":"Name","value":"getCourseCompletionReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"airlineId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"airlineId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseTitle"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}}]}}]}}]} as unknown as DocumentNode<LandingDetailsQuery, LandingDetailsQueryVariables>;
export const AdminDeleteCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminDeleteCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminDeleteCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<AdminDeleteCourseMutation, AdminDeleteCourseMutationVariables>;
export const ListMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"publicURL"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<ListMediaQuery, ListMediaQueryVariables>;
export const AdminChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"adminChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminChangePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<AdminChangePasswordMutation, AdminChangePasswordMutationVariables>;
export const AdminMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"adminMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<AdminMeQuery, AdminMeQueryVariables>;
export const PublicLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicLoginMutation, PublicLoginMutationVariables>;
export const PublicLoginSsoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicLoginSSO"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicLoginSSO"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicLoginSsoMutation, PublicLoginSsoMutationVariables>;
export const PublicForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicForgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<PublicForgotPasswordMutation, PublicForgotPasswordMutationVariables>;
export const PublicResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicResetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<PublicResetPasswordMutation, PublicResetPasswordMutationVariables>;
export const PublicSignupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicSignup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicSignup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstName"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastName"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicSignupMutation, PublicSignupMutationVariables>;
export const PublicResendLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicResendLoginOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"OTPType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicResendLoginOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"OTPType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"OTPType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<PublicResendLoginOtpMutation, PublicResendLoginOtpMutationVariables>;
export const VerifySignupOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifySignupOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifySignupOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifySignupOtpMutation, VerifySignupOtpMutationVariables>;
export const VerifyLoginOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"verifyLoginOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyLoginOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"otp"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}},{"kind":"Argument","name":{"kind":"Name","value":"rememberMe"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rememberMe"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<VerifyLoginOtpMutation, VerifyLoginOtpMutationVariables>;
export const UpdateUserEmailSubscriptionStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserEmailSubscriptionStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserEmailSubscriptionStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}]}]}}]} as unknown as DocumentNode<UpdateUserEmailSubscriptionStatusMutation, UpdateUserEmailSubscriptionStatusMutationVariables>;
export const GetCertificatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCertificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCertificates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"certification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"}},{"kind":"Field","name":{"kind":"Name","value":"certificateDetails"}}]}}]}}]}}]} as unknown as DocumentNode<GetCertificatesQuery, GetCertificatesQueryVariables>;
export const GetCertificateByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCertificateById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificateId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCertificatesById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificateId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificateId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"certification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"}},{"kind":"Field","name":{"kind":"Name","value":"certificateDetails"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetCertificateByIdQuery, GetCertificateByIdQueryVariables>;
export const CreateCertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCertificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCertificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"certificationId"}}]}}]}}]} as unknown as DocumentNode<CreateCertificateMutation, CreateCertificateMutationVariables>;
export const PublicGetAllCertificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"publicGetAllCertifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicGetAllCertifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"}},{"kind":"Field","name":{"kind":"Name","value":"certificateDetails"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PublicGetAllCertificationsQuery, PublicGetAllCertificationsQueryVariables>;
export const PublicGetCertificationByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"publicGetCertificationById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicGetCertificationById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"pdf"}},{"kind":"Field","name":{"kind":"Name","value":"certificateDetails"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"certificationId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"certificate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<PublicGetCertificationByIdQuery, PublicGetCertificationByIdQueryVariables>;
export const GetLessonSlidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLessonSlides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLessonSlides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"templateKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}}]}}]} as unknown as DocumentNode<GetLessonSlidesQuery, GetLessonSlidesQueryVariables>;
export const GetQuizSlidesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getQuizSlides"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getQuizSlides"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"templateKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}}]}}]}}]} as unknown as DocumentNode<GetQuizSlidesQuery, GetQuizSlidesQueryVariables>;
export const GetAllLessonProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllLessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllLessonProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlides"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"certificationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"lessonsSlides"}},{"kind":"Field","name":{"kind":"Name","value":"quizSlides"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"successTitle"}},{"kind":"Field","name":{"kind":"Name","value":"successDescription"}},{"kind":"Field","name":{"kind":"Name","value":"successButtonText"}}]}}]}}]}}]} as unknown as DocumentNode<GetAllLessonProgressQuery, GetAllLessonProgressQueryVariables>;
export const GetLessonProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getLessonProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getLessonProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"progress"}},{"kind":"Field","name":{"kind":"Name","value":"totalSlides"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lesson"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"certificationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"lessonsSlides"}},{"kind":"Field","name":{"kind":"Name","value":"quizSlides"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"successTitle"}},{"kind":"Field","name":{"kind":"Name","value":"successDescription"}},{"kind":"Field","name":{"kind":"Name","value":"successButtonText"}}]}}]}}]}}]} as unknown as DocumentNode<GetLessonProgressQuery, GetLessonProgressQueryVariables>;
export const UpdateLessonProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLessonProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isCompleted"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonProgressId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLessonProgress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isCompleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isCompleted"}}},{"kind":"Argument","name":{"kind":"Name","value":"progress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progress"}}},{"kind":"Argument","name":{"kind":"Name","value":"lessonProgressId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonProgressId"}}}]}]}}]} as unknown as DocumentNode<UpdateLessonProgressMutation, UpdateLessonProgressMutationVariables>;
export const GetAllLessonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllLessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllLessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"certificationDetails"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"lessonsSlides"}},{"kind":"Field","name":{"kind":"Name","value":"quizSlides"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAllLessonsQuery, GetAllLessonsQueryVariables>;
export const StartLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"startLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<StartLessonMutation, StartLessonMutationVariables>;
export const RestartLessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restartLesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restartLesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lessonId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lessonId"}}}]}]}}]} as unknown as DocumentNode<RestartLessonMutation, RestartLessonMutationVariables>;
export const RestartCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restartCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restartCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"certificationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"certificationId"}}}]}]}}]} as unknown as DocumentNode<RestartCourseMutation, RestartCourseMutationVariables>;
export const UserMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"userMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"airline"}}]}}]}}]} as unknown as DocumentNode<UserMeQuery, UserMeQueryVariables>;
export const PublicChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicChangePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<PublicChangePasswordMutation, PublicChangePasswordMutationVariables>;
export const PublicUploadAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicUploadAvatar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicUploadAvatar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}}]}]}}]} as unknown as DocumentNode<PublicUploadAvatarMutation, PublicUploadAvatarMutationVariables>;
export const PublicDeleteAvatarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"publicDeleteAvatar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicDeleteAvatar"}}]}}]} as unknown as DocumentNode<PublicDeleteAvatarMutation, PublicDeleteAvatarMutationVariables>;
export const GetUserSavedItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserSavedItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserSavedItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"savedItemKey"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"displayData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}},{"kind":"Field","name":{"kind":"Name","value":"footerText"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"certificateId"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserSavedItemsQuery, GetUserSavedItemsQueryVariables>;
export const UserAddToSaveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userAddToSave"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"itemType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"savedItemType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToSave"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"itemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"itemType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"itemType"}}}]}]}}]} as unknown as DocumentNode<UserAddToSaveMutation, UserAddToSaveMutationVariables>;
export const UserRemoveFromSaveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"userRemoveFromSave"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"savedId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromSave"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"saveId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"savedId"}}}]}]}}]} as unknown as DocumentNode<UserRemoveFromSaveMutation, UserRemoveFromSaveMutationVariables>;
export const GetCourseUpdateNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCourseUpdateNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCourseUpdateNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notificationData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetCourseUpdateNotificationQuery, GetCourseUpdateNotificationQueryVariables>;
export const GetReminderNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getReminderNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getReminderNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notificationData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetReminderNotificationQuery, GetReminderNotificationQueryVariables>;
export const GetSystemNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getSystemNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSystemNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notificationData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetSystemNotificationQuery, GetSystemNotificationQueryVariables>;
export const GetAllNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"notificationData"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<GetAllNotificationsQuery, GetAllNotificationsQueryVariables>;
export const GetAndUpdateUserNotificationLastSeenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getAndUpdateUserNotificationLastSeen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAndUpdateUserNotificationLastSeen"}}]}}]} as unknown as DocumentNode<GetAndUpdateUserNotificationLastSeenQuery, GetAndUpdateUserNotificationLastSeenQueryVariables>;
export const GetUserNotificationLastSeenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUserNotificationLastSeen"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUserNotificationLastSeen"}}]}}]} as unknown as DocumentNode<GetUserNotificationLastSeenQuery, GetUserNotificationLastSeenQueryVariables>;
export const TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"test"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"test"}}]}}]} as unknown as DocumentNode<TestQuery, TestQueryVariables>;