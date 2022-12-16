export const postMapper = (id, post) => {
  const currentUserStatus = post.totalActions.find(
    (el) => el.userId === id && el.isBanned === false,
  );
  const likesCount = post.totalActions.filter(
    (el) => el.action === 'Like' && el.isBanned === false,
  ).length;
  const dislikesCount = post.totalActions.filter(
    (el) => el.action === 'Dislike' && el.isBanned === false,
  ).length;
  const actions = post.totalActions;
  return {
    createdAt: post.createdAt,
    id: post.id,
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    extendedLikesInfo: {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: currentUserStatus ? currentUserStatus.action : 'None',
      newestLikes: actions
        .filter((el) => el.action === 'Like' && el.isBanned === false)
        .reverse()
        .slice(0, 3)
        .map((el) => {
          delete el.action;
          delete el.isBanned;
          return el;
        }),
    },
  };
};
