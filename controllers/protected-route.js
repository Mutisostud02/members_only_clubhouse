const { getAllPosts, getPostById, addNewPost } = require("../config/db/query")


async function protectedRouteUserPage(req, res) {
    if(!req.isAuthenticated()) {
        return res.redirect('/log-in')
    }
    try {
        const posts = await getAllPosts()
        res.render('protected-route', {
            user: req.user,
            posts: posts,
        })
    } catch(error) {
        console.error(error)
        res.status(500).send('Server error!')
    }
}

async function protectedRouteAddPost (req, res) {
    if(!req.isAuthenticated()) {
        return res.redirect('/log-in')
    }

    const { topic, post } = req.body;
    try {
        const user = req.user
        await addNewPost(user.id, topic, post);
        res.redirect('/protected-route')
    } catch(error) {
        console.error(error)
        res.status(500).send('Server error!')
    }
}

async function protectedRouteGetPostById(req, res) {
    if(!req.isAuthenticated()) {
        return res.redirect('/log-in')
    }
    const { id } = req.params;
    try {
        const post = await getPostById(id)
        if (!post) {
            return res.status(404).send('Post not found');
        }
        res.render('post', {
            user: req.user,
            post
        })
    } catch(err) {
        console.error(err)
        res.status(500).send('Server error!')
    }
}
module.exports = { protectedRouteUserPage, protectedRouteAddPost, protectedRouteGetPostById }