var nao_ip = '193.48.125.63';
var session = new QiSession(nao_ip);

session.socket().on('connect', function () {
  console.log('Connecté au robot !');

$("#nipple_0_0").append(function(){
  		var options={
  			zone: document.getElementById('nipple_0_0'),
  			mode: 'static', //peut aussi être dynamic ou semo
  			position : {left:'50%',top:'60%'},
  			color:'blue',
  			restOpacity:100,
  			threshold:0.2
  		}

  		//le joystick est créé à partir de la bibliothèque nipplejs
  		var manager = nipplejs.create(options);

  	//ensuite on définit les fonction que le joystick va nous permettre d'effectuer

  		//si le joystick est vers le haut la tête va se lever
  		//On utilise ALMotion pour faire bouger le robot
  		//HeadPitch est le joint du cou qui permet de lever ou baisser la tête
  		manager.on('dir:up',function(evt,nipple){
  			session.service("ALMotion").done(function(motionProxy){
  				motionProxy.changeAngles('HeadPitch',-0.3,0.1);
  				console.log('up');
  			});
  		});

  		//si le joystick est vers le bas la tête se baisse
	  	manager.on('dir:down',function(evt,nipple){
	  		session.service("ALMotion").done(function(motionProxy){
	  			motionProxy.changeAngles('HeadPitch',0.3,0.1);
	  			console.log('down');
	  		});
	  	});

	  	//si le joystick est vers la droite la tête se tourne à droite
	  	//HeadYaw est le joint du cou qui permet de tourner la tête à gauche ou à droite
	  	manager.on('dir:right',function(evt,nipple){
	  		session.service("ALMotion").done(function(motionProxy){
	  			motionProxy.changeAngles('HeadYaw',-0.5,0.2);
	  			console.log('right');
	  		});
	  	});

	  	//si le joystick est vers la gauche la tête se tourne à gauche
	  	manager.on('dir:left',function(evt,nipple){
	  		session.service("ALMotion").done(function(motionProxy){
	  			motionProxy.changeAngles('HeadYaw',0.5,0.2);
	  			console.log('left');
	  		});
	  	});

	  	//quand on arrête d'utiliser le joystick la tête arrête de bouger
	  	manager.on('end',function(evt,nipple){
	  		session.service("ALMotion").done(function(motionProxy){
	  			motionProxy.stopMove();
	  			console.log('stop');
	  		});
	  	});
  	});

  	//on désactive la vie autonome sans désasservir le robot
  	session.service("ALAutonomousLife").done(function(autonomousLifeProxy){
  		autonomousLifeProxy.setState("safeguard"); //peut aussi être solitary, interactive ou disabled
  	});

  	//on définit la fonction du bouton "attirer l'attention"
  	//au clic, le robot lève le bras droit (RShoulderPitch leve le bras, RShoulderRoll tourne le bras) et ouvre la main (openHand)
  	//après 4 secondes, le robot revient à la posture "StandInit"
  	$("#attention").click(function(){
  		session.service("ALMotion").done(function(motionProxy){
  			motionProxy.setAngles(["RShoulderPitch","RShoulderRoll"],[-1,-0.25],0.2);
  			motionProxy.openHand("RHand");
  			setTimeout(function(){
  				session.service("ALRobotPosture").done(function(robotPostureProxy){
  					robotPostureProxy.goToPosture("StandInit",1.0);
  				});
  			},4000);
  		});
  	});

  	//on définit la fonction du bouton "tête centre"
  	//au clic, le robot remet  la tete droite grâce aux joint HeadYaw et HeadPitch
  	$("#tetecentre").click(function(){
  		session.service("ALMotion").done(function(motionProxy){
  			motionProxy.setAngles(['HeadYaw','HeadPitch'],[0.0,0.0],0.2);
  		});
  	});

  	//on définit la fonction du bouton "avancer"
  	//la fonction moveTo(0.3,0,0) permet de faire avancer le robot à un point situé à 0.3m devant lui
  	$("#avancer").click(function(){
  		session.service("ALMotion").done(function(motionProxy){
  			motionProxy.moveTo(0.3,0,0);
  			console.log("avancer");
  		});
  	});

  	//on définit la fonction du bouton "droite"
  	//la fonction moveTo(0,-0.3,0) permet de faire avancer le robot à un point situé à 0.3m à sa droite
  	$("#droite").click(function(){
  		session.service("ALMotion").done(function(motionProxy){
  			motionProxy.moveTo(0,-0.3,0);
  		});
  	});

  	//on définit la fonction du bouton "gauche"
  	//la fonction moveTo(0,0.3,0) permet de faire avancer le robot à un point situé à 0.3m à sa gauche
  	$("#gauche").click(function(){
  		session.service("ALMotion").done(function(motionProxy){
  			motionProxy.moveTo(0,0.3,0);
  		});
  	});

  	//on définit la fonction du bouton parler
  	//au clic, le robot récupère le texte entré dans la zone d'input "message" et utilise sa fonction tts pour le lire
  	//on vide ensuite la zone "message"
  	$("#parler").click(function(){
  		session.service("ALTextToSpeech").done(function(tts){
  			tts.say($("#message").val());
  			$("#message").val('');
  		});
  	});

  	//on définit la fonction du bouton "tournergauche"
  	//la fonction moveTo(0,0,1) permet au robot de faire 1/4 de tour sur lui même vers sa gauche
  	$('#tournergauche').click(function(){
  		session.service("ALMotion").done(function(motionProxy){
	  		motionProxy.moveTo(0,0,1);
	  	});
  	});

  	//on définit la fonction du bouton "tournerdroite"
  	//la fonction moveTo(0,0,-1) permet au robot de faire 1/4 de tour sur lui même vers sa droite
  	$('#tournerdroite').click(function(){
  		session.service("ALMotion").done(function(motionProxy){
	  		motionProxy.moveTo(0,0,-1);
	  	});
  	});


//Ici on définit les fonction des boutons situés dans le menu déroulant "posture du robot"

	//Au clic sur les boutons du menu déroulant, le robot change de posture parmis les postures prédéfinies
  	$("#Sit").click(function(){
  		session.service("ALRobotPosture").done(function(postureProxy){
  			postureProxy.goToPosture("Sit",1.0);
  		});
  	});

  	$("#Stand").click(function(){
  		session.service("ALRobotPosture").done(function(postureProxy){
  			postureProxy.goToPosture("Stand",1.0);
  		});
  	});

  	$("#Crouch").click(function(){
  		session.service("ALRobotPosture").done(function(postureProxy){
  			postureProxy.goToPosture("Crouch",1.0);
  		});
  	});


}).on('disconnect', function () {
  console.log('Déconnecté du robot !');
});
