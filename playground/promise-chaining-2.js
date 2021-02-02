require('../src/db/mongoose')
const Task = require('../src/models/task')

const deleteAndCountByAge = async (id, completed) => {
    const del = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed})
    return count
}

deleteAndCountByAge('601661070117fd5a1460d0cc', false).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})

// Task.findByIdAndDelete('601661070117fd5a1460d0cc').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })