var express = require('express');
var router = express.Router();
const Seans = require('../models/Seans');
const Film = require('../models/Film');
const str = require('../strings');
const cnf = require('../config');

router.get('/:id', async (req, res, next) => {

  const id = req.params.id;
  if(id){
    const seans = await Seans.findOne({
        filmId: id
    });
    const film = await Film.findById(id);
    res.render('index', { o: {
        seans: true,
        receivedSeans: seans,
        receivedFilm: film
    }});
  }else{
    res.json({error: 'No id found into URL'});
  }  
});
router.post('/change-ticket-status', async (req, res, next) => {
  const { id, row, col, status } = req.body;
  if(!id || !row || !col){
    res.json({
      error: "id, col, row is required!"
    });
  }else{
    try{
      const seans = await Seans.findById(id);
      let areas = Array.from(seans.areas);
      let catchRejection = false;
      areas = areas.filter((area)=>{
        if(area.row === row && area.col === col){ 
          if(area.status !== cnf.POSITION_STATUS_SOLD){
            return false;
          }else{
            catchRejection = true;
          }
        }
        return true;
      });
      if(!catchRejection){
        areas.push({
          row,
          col,
          userId: req.jwt._id,
          status
        });
        await Seans.updateOne({_id : id },{
          areas 
        },{new: true});
        const successMsg = status===0?'Your ticket unreserved succesfuly!':status===1?'Your ticket reserved succesfuly!':'Ticket purchased successfuly!';
        res.json({
          success: successMsg
        });
      }else{
        res.json({
          error: 'This ticket already purchased! </br> Choose another one'
        });
      }
    }catch(err){
      res.json({
        error: err.message
      });
    }
  }
});

module.exports = router;
