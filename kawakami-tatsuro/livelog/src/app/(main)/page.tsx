import { deletePost } from "@/features/posts/service";
import { Post } from "@/features/posts/types";
import { formatDateForInput } from "@/lib/utils";

const CURRENT_USER_ID = 1

const Home = async () => {
  const response = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store'
  })

  const data = await response.json();
  const posts: Post[] = data.data;

  
  return (
    <main>
      <h1 style={{ marginBottom: '16px', fontSize: '24px' }}>Timeline</h1>
        {posts.map((post) => {
          const deleteThisPost = deletePost.bind(null, post.id)
          
        return(
          <div key={post.id}>
            <p>{formatDateForInput(post.created_at)}</p>
            <p>{post.user_name}</p>
            <p>{post.content}</p>
            <p>{formatDateForInput(post.show_date)}</p>
            <p>{post.artist_name}</p>
            <iframe data-testid="embed-iframe" style={{ borderRadius: '12px' }} src={`https://open.spotify.com/embed/track/${post.track_id}?utm_source=generator`} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            {post.user_id === CURRENT_USER_ID && (
              <form action={deleteThisPost}>
                <input type="submit" value="Delete" />
              </form>
            )}
            <hr />
          </div>
        )
      })}
      </main>
    )
}

export default Home
