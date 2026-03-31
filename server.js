const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const Shifts = require('./models/shifts')
const app = express();
const PORT = 3000;
// middleware - for body for POST/PUT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// in the main page - return HTML file

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/Shifts');


app.get("/all", (req, res) => {
    Shifts.find({}).sort("id")
        .exec()
        .then(result => { res.json(result) })
        .catch(err => { console.log(err) })
});

let idGen = 1;
app.post('/add', (req, res) => {
    const newShift = new Shifts({
        _id: new mongoose.Types.ObjectId(),
        id: idGen++,
        sunday: req.body.sunday,
        monday: req.body.monday,
        tuesday: req.body.tuesday,
        wednesday: req.body.wednesday,
        thursday: req.body.thursday
    });
    newShift.save()
        .then(() => {
            res.status(201).json({ msg: 'added to database', ack: 1 });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ msg: err.message });
        })
})


app.put('/update/:id', (req, res) => {
    const id = req.params.id
    if (req.body.id) {
        Shifts.exists({ id: +req.body.id }).then(result => {
            if (result) {
                res.status(500).json({ msg: "denied", ack: -1 })
                return;
            } else {
                Shifts.updateOne({ id: id }, { $set: req.body }).exec()
                    .then(result2 => { res.status(200).json({ msg: 'success', ack: 1 }); })
                    .catch(err => { console.log(err); res.status(500).json({ msg: err.message, ack: -1 }) })
            }
        })
    } else {
        console.log(req.body);
        Shifts.updateOne({ id: id }, { $set: req.body }).exec()
            .then(result => { res.status(200).json({ msg: 'success', ack: 1 }) })
            .catch(err => { console.log(err); res.status(500).json({ msg: err.message }) })
    }
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    Shifts.deleteOne({ id: id }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => res.status(500).json({ error: err }))
})

app.delete('/deleteAll', (req, res) => {
    Shifts.deleteMany({}).exec()
        .then(result => {
            idGen = 1;
            res.status(200).json(result)
        })
        .catch(err => res.status(500).json({ error: err }))

})


app.listen(PORT, '0.0.0.0', () => console.log(`Listening in PORT ${PORT}`));