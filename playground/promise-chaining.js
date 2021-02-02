require('../src/db/mongoose')
const User = require('../src/models/user')

const _id = '60165447e5485756d405bfd5'

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const countDoc = await User.countDocuments({ age })
    return countDoc
}

updateAgeAndCount(_id, 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})

// User.findByIdAndUpdate(_id, { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })