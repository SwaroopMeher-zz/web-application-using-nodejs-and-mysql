var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
var router = express.Router();

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '1404',
  database: "Tseries"
});

app.set('view engine', 'ejs');
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true })); // to support URL-encoded bodies
app.use(express.static(__dirname + '/login'));

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
console.log('connected as id ' + connection.threadId);
});

let error,erl="",username="Guest";
app.post('/login_auth', function (req, res) {
 username=req.body.username;
  var password=req.body.pass;
  connection.query("select aes_decrypt(password,'1404') as password FROM users where user_name=?",username, function (err, result) {
    // if (err) throw err;
    console.log('RESULT:%j', result);
    if (err) {
    console.log("error ocurred",error);
      error="error ocurred";
      erl=error.length;
  }
  else{
    // console.log('The solution is: ', results);
    if(result.length >0){
      if(result[0]["password"] == password){
        res.render('C:/Users/mmssw/Desktop/dbms_js/Login/option',{username:username});
      }
      else{
          error="Username and password does not match";
          erl=error.length;
        }
      }
    else{

        error="Username does not exits";
        erl=error.length;

    }
  }
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/index',{ error:error,erl:erl});
  });
});
app.get('/', function (req, res) {
  if(erl >0){
    error="";
  }
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/index',{ error:error,erl:erl});
});


app.get('/option', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/option',{username:username});
});

// -------------------------------------------------------------------------------------

var fname,surname,pno,address,inu,mk,res_fm=[];
var erlm=0,errorm="";
app.post('/find_m', function (req, res) {
  var params=[req.body.Firstname,req.body.Surname];

  connection.query("SELECT *,i.name_mi,i.m_key FROM musician m,instrument i where first_name=? and surname=? and m.id_i=i.id_i",params, function (err, result) {
    if (err) {
      errorm="Unknown error!"
    }
res_fm=result;
    console.log('RESULT:%j', result);
    if(result.length >0){
    fname=result[0]["first_name"];
    surname=result[0]["surname"];
    address=result[0]["address"];
    pno=result[0]["phone_no"];
    inu=result[0]["name_mi"];
    mk=result[0]["m_key"];
    errorm="";
}
else{
  if(params[0]=="" && params[1]==""){
    if(result.length>0){
      fname="",surname="",pno="",address="",inu="",mk="";
    }
errorm="Please type the name of the musician you want to search";
  }
else{
  if(result.length>0){
    fname="",surname="",pno="",address="",inu="",mk="";
  }
  errorm="Sorry, no musician named "+"'"+params[0]+" "+params[1]+"'"+" was found!";
  }
}
erlm=errorm.length;
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/musicians',{ fname:fname,surname:surname,address:address,pno:pno,inu:inu,mk:mk,errorm:errorm});
  });
});
app.get('/musicians', function (req, res) {
  if(erlm >0){
    errorm="";
  }
  if(res_fm.length>0){
    fname="",surname="",pno="",address="",inu="",mk="";
  }
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/musicians',{ fname:fname,surname:surname,address:address,pno:pno,inu:inu,mk:mk,errorm:errorm});
});

// --------------------------------------------------------------------------------------------------

let rs;
app.post('/add_user', function (req, res) {
  var params=[req.body.username,req.body.pass];
  connection.query("INSERT INTO users VALUES(?,AES_ENCRYPT(?,'1404'))",params, function (err, result) {
    if (err) throw err;
    console.log('Inserted');
    rs='New user added!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/new_user',{ r:rs });
  });
});
app.get('/new_user', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/new_user',{ r:rs });
});


var rm;
app.post('/add_m', function (req, res) {
  var params=[req.body.ssn,req.body.Firstname,req.body.Surname,req.body.Address,req.body.Phone_no,req.body.i_id];
  connection.query("INSERT INTO musician VALUES(?,?,?,?,?,?)",params, function (err, result) {
    if (err) throw err;
    console.log('Inserted');
    rm='New musician added!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_m',{ r:rm });
  });
});
app.get('/add_m', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_m',{ r:rs });
});



var um='',errorum='',erlmu;
app.post('/update_m', function (req, res) {
  var params=[req.body.Firstname,req.body.Surname,req.body.Address,req.body.Phone_no,req.body.i_id,req.body.ssn];
  connection.query("UPDATE musician set first_name=?,surname=?,address=?,phone_no=?,id_i=? where ssn=?",params, function (err, result) {
    if (err) {
      errorum="Enter correct ssn :-)"
    };
    console.log('Updated!');
    um='Updated!';
    erlmu=errorum.length;
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_m',{ r:um,errorum:errorum});
  });
});
app.get('/update_m', function (req, res) {
  if(erlmu >0){
    errorum="";
  }
  if(um.length>0){
    um="";
  }
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_m',{ r:um,errorum:errorum });
});


var dm,ndm;
app.post('/delete_m', function (req, res) {
  var params=[req.body.ssn];
  connection.query("DELETE FROM musician where ssn=?",params, function (err, result) {
    if (err) throw err;
   ndm=req.body.ssn;
    console.log('Deleted!');
    dm='Deleted';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_m',{ r:dm,ndm:ndm });
  });
});
app.get('/delete_m', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_m',{ r:dm ,ndm:ndm});
});



var ai;
app.post('/add_i', function (req, res) {
  var params=[req.body.id_i,req.body.name_mi,req.body.m_key];
  connection.query("INSERT INTO instrument VALUES(?,?,?)",params, function (err, result) {
    if (err) throw err;
    console.log('Inserted');
    ai='New instrument added!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_i',{ r:ai });
  });
});
app.get('/add_i', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_i',{ r:ai });
});



var ui;
app.post('/update_i', function (req, res) {
  var params=[req.body.name_mi,req.body.m_key,req.body.id_i];
  connection.query("UPDATE instrument set name_mi=?,m_key=? where id_i=?",params, function (err, result) {
    if (err) throw err;
    console.log('updated!');
    ui='Instrument Updated!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_i',{ r:ui });
  });
});
app.get('/update_i', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_i',{ r:ui });
});



var di,ndi;
app.post('/delete_i', function (req, res) {
  var params=[req.body.id_i];
  connection.query("DELETE FROM instrument where id_i=?",params, function (err, result) {
    if (err) throw err;
   ndm=req.body.ssn;
    console.log('Deleted!');
    di='Deleted';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_i',{ r:di,ndi:ndi });
  });
});
app.get('/delete_i', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_i',{ r:dm ,ndi:ndi});
});



var aa;
app.post('/add_a', function (req, res) {
  var params=[req.body.id_a,req.body.title,req.body.cp_date,req.body.format1,req.body.producer_id];
  connection.query("INSERT INTO album VALUES(?,?,?,?,?)",params, function (err, result) {
    if (err) throw err;
    console.log('Inserted');
    aa='New Album added!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_a',{ r:aa });
  });
});
app.get('/add_a', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_a',{ r:aa });
});



var ua;
app.post('/update_a', function (req, res) {
  var params=[req.body.title,req.body.cp_date,req.body.format1,req.body.producer_id,req.body.id_a];
  connection.query("UPDATE album set title=?,cp_date=?,format1=?,producer_id=? where id_a=?",params, function (err, result) {
    if (err) throw err;
    console.log('updated!');
    ua='Album Updated!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_a',{ r:ua });
  });
});
app.get('/update_a', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_a',{ r:ua });
});



var da,nda;
app.post('/delete_a', function (req, res) {
  var params=[req.body.id_a];
  connection.query("DELETE FROM album where id_a=?",params, function (err, result) {
    if (err) throw err;
   nda=req.body.id_a;
    console.log('Deleted!');
    da='Deleted';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_a',{ r:da,nda:nda });
  });
});
app.get('/delete_a', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_a',{ r:da ,nda:nda});
});



var as;
app.post('/add_s', function (req, res) {
  var params=[req.body.id_a,req.body.title,req.body.author];
  connection.query("INSERT INTO song VALUES(?,?,?)",params, function (err, result) {
    if (err) throw err;
    console.log('Inserted');
    as='New song added!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_s',{ r:as });
  });
});
app.get('/add_s', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/add_s',{ r:as });
});



var us;
app.post('/update_s', function (req, res) {
  var params=[req.body.id_a,req.body.author,req.body.title];
  connection.query("UPDATE song set id_a=?,author=? where title=?",params, function (err, result) {
    if (err) throw err;
    console.log('updated!');
    us='Song Updated!';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_s',{ r:us });
  });
});
app.get('/update_s', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/update_s',{ r:us });
});



var ds,nds;
app.post('/delete_s', function (req, res) {
  var params=[req.body.title];
  connection.query("DELETE FROM song where title=?",params, function (err, result) {
    if (err) throw err;
   nds=req.body.title;
    console.log('Deleted!');
    ds='Deleted';
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_s',{ r:ds,nds:nds });
  });
});
app.get('/delete_s', function (req, res) {
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/delete_s',{ r:ds ,nds:nds});
});



var inst;
app.get('/instruments', function (req, res) {
  connection.query("SELECT * FROM instrument", function (err, result) {
    if (err) throw err;
    console.log('RESULT:%j', result);
    inst = result;
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/instruments',{ inst:inst });
    });
});



var atitle,stitle,format,producer,author,res_fs=[];
var errors="",erls=0;
app.post('/find_s', function (req, res) {
  var params=[req.body.Name];

  connection.query("SELECT *,s.title as stitle,a.title as atitle,a.format1,m.first_name FROM song s,album a,musician m where s.title=?  and s.id_a=a.id_a and a.producer_id=m.ssn",params, function (err, result) {
    if (err) throw err;
    res_fs=result;
        console.log('RESULT:%j', result);
        if(result.length >0){
    console.log('RESULT:%j', result);
    atitle=result[0]["atitle"];
    stitle=result[0]["stitle"];
    format=result[0]["format1"];
    producer=result[0]["first_name"];
    author=result[0]["author"];
    errors="";
  }
  else{
    if(params[0]==""){
      if(res_fs.length>0){
        atitle="",stitle="",format="",producer="",author="";
      }
  errors="Please type the name of the song you want to search";
    }
  else{
    if(res_fs.length>0){
      atitle="",stitle="",format="",producer="",author="";
    }
    errors="Sorry, no song named "+"'"+params[0]+"'"+" was found!";
    }
  }
  erls=errors.length;
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/songs',{ atitle:atitle,stitle:stitle,format:format,producer:producer,author:author,errors:errors});
  });
});
app.get('/songs', function (req, res) {
  if(erls>0){
    errors="";
  }
  if(res_fs.length>0){
    atitle="",stitle="",format="",producer="",author="";
  }
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/songs',{ atitle:atitle,stitle:stitle,format:format,producer:producer,author:author,errors:errors});
});


let aatitle,aformat,aproducer,aid,cpdt,res_fa=[];
var errora="",erla=0;;
let astitle=[];
let aauthor=[];
app.post('/find_a', function (req, res) {
  var params=req.body.AName;
  connection.query("SELECT a.id_a,a.cp_date,a.format1,s.title as stitle,a.title as atitle,s.author,m.first_name FROM album a,song s,musician m where a.title=?  and s.id_a=a.id_a and a.producer_id=m.ssn",params, function (err, result) {
    if (err) throw err;
    res_fa=result;
        console.log('RESULT:%j', result);
        if(result.length >0){
    aid=result[0]["id_a"];
    cpdt=result[0]["cp_date"];
    aatitle=result[0]["atitle"];
    aformat=result[0]["format1"];
    aproducer=result[0]["first_name"];
    for(var i=0;i<result.length;i++){
      if(result.length==1){
        aauthor[i]=result[i]["author"];
        astitle[i]=result[i]["stitle"];
          aauthor[i+1]=null;
          astitle[i+1]=null;
          aauthor.pop();
          astitle.pop();
        } else{
      aauthor[i]=result[i]["author"];
      astitle[i]=result[i]["stitle"];
      errora="";
    }
  }
}
else{
  if(params==""){
errora="Please type the name of the album you want to search";
  }
else{
  if(res_fa.length>0){
    aatitle="",aformat="",aproducer="",aid="",cpdt="";
  }
  errora="Sorry, no album named "+"'"+params+"'"+" was found!";
  }
}
erla=errors.length;
    res.render('C:/Users/mmssw/Desktop/dbms_js/Login/albums',{ aatitle:aatitle,astitle:astitle,aformat:aformat,aproducer:aproducer,aauthor:aauthor,aid:aid,cpdt:cpdt,errora:errora});
  });
});
app.get('/albums', function (req, res) {
  if(erla>0){
    errora="";
  }
  if(res_fa.length>0){
    aatitle="",aformat="",aproducer="",aid="",cpdt="",astitle=[],aauthor=[];
  }
  res.render('C:/Users/mmssw/Desktop/dbms_js/Login/albums',{ aatitle:aatitle,astitle:astitle,aformat:aformat,aproducer:aproducer,aauthor:aauthor,aid:aid,cpdt:cpdt,errora:errora});
});


app.listen(8099);
