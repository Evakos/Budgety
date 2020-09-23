User.findOne({_id: req.session.user._id}, (err, user) => {
    let userMetaId = user.usermeta // we will get the usermeta id
    UserMeta.findOne({_id: userMetaId}, (err, userMeta) => {
        userMeta.amount
    })
})

User.findOne({_id: req.session.user._id}).populate('usermeta').exec((err, user) => {
    user.usermeta.amount
})