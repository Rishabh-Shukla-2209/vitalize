
const SocialProfile = () => {
//     const [followStatus, setFollowStatus] = useState(post.followStatus);

//     const updateFollowQueryData = useCallback(
//         (newFollowStatus: FollowStatus, followingId: string) => {
//           queryClient.setQueryData<{
//             pages: GetPostsResponse[];
//             pageParams: PageParam[];
//           }>(["feed", userId], (oldData) => {
//             if (!oldData) return oldData;
//             return {
//               ...oldData,
//               pages: oldData.pages.map((page) => ({
//                 ...page,
//                 posts: page.posts.map((p) =>
//                   p.userid === followingId
//                     ? {
//                         ...p,
//                         followStatus: newFollowStatus
//                       }
//                     : p
//                 ),
//               })),
//             };
//           });
//         },
//         [queryClient, userId]
//       );

//       useEffect(() => {
//           if (followStatus === post.followStatus) return;
      
//           const timer = setTimeout(() => {
//             const action = post.followStatus === "Accepted" || post.followStatus === "Requested" ? "unFollow" : "follow"; 
//             console.log(2);
            
//             // saveFollowing(userId, post.userid, post.user.privacy, action);
//             updateFollowQueryData(followStatus, post.userid);
//           }, 2000);
      
//           return () => clearTimeout(timer);
//         }, [followStatus, post.user.privacy, post.userid, updateFollowQueryData, userId]);

//         const changeFollowStatus = () => {
//             if(followStatus === "Accepted" || followStatus === "Requested") {
//               setFollowStatus("Not Following");
//               return;
//             }
        
//             if(post.user.privacy === "PRIVATE"){
//               setFollowStatus("Requested");
//             }else{
//               setFollowStatus("Accepted");
//             }
//           }
//   return (
//     <div>
//           <Button
//             variant={
//               followStatus === "Accepted" || followStatus === "Requested"
//                 ? "outline"
//                 : "default"
//             }
//             className="rounded-l-full rounded-r-full"
//             onClick={changeFollowStatus}
//           >
//             {followStatus === "Accepted"
//               ? "Following"
//               : followStatus === "Requested"
//               ? "Requested"
//               : "Follow"}
//           </Button>
//         </div>
//   )

return <div>TODO</div>
}

export default SocialProfile