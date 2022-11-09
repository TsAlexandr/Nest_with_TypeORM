export function mapper(value, userId) {
  const currentUserStatus = value.totalActions.find(
    (el: { userId: string }) => el.userId === userId,
  );
  const likesCount = value.totalActions.filter(
    (el) => el.action === 'Like',
  ).length;
  const dislikesCount = value.totalActions.filter(
    (el) => el.action === 'Dislike',
  ).length;
  const actions = value.totalActions;
  return {
    addedAt: value.addedAt,
    id: value.id,
    title: value.title,
    shortDescription: value.shortDescription,
    content: value.content,
    blogId: value.blogId,
    blogName: value.blogName,
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: currentUserStatus ? currentUserStatus.action : 'None',
      newestLikes: actions
        .filter((el) => el.action === 'Like')
        .slice(-3)
        .map((el) => {
          delete el.action;
          return el;
        }),
    },
  };
}
