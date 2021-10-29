# Hackathon


- Start IN-CSE in server (PC for example)
- Start MN-CSE in Raspberry (Change the initial configuration to remote MN-CSE to IN-CSE --> l14 put IN-CSE IP, for value for the parameter org.eclipse.om2m.cseBaseAddress)

To execute IPE (I'm not sure we need an IPE...):

- Install maven 3.6.0 (maybe the latest version works but i didn't try yet)
- Then, in a terminal run this line : mvn clean install
- Finally to compile and run controler class (from the pom.xml repository) : mvn exec:java -Dexec.classpathScope=compile




- Script .ino côté objet : Fait mais reste à tester --> Le capteur s'enregistre sur la plateforme OM2M (pour l'instant sur le MN, mais à terme surement sur le IN, à voir si prétraitement au niveau du MN pour que ce dernier ait une utilité). C'est à dire création des de l'AE et des deux containers (DESCRIPTOR et DATA). Egalement, création d'une ressource Souscription au niveau du container DATA, une entité pourra s'y connecter pour être automatiquement notifié d'une nouvelle donnée. Enfin, acquisition d'une donnée de facon périodique et création d'une instance de contenue dans le container DATA correspondant à la donnée.
--> Script NodeMCU....ino testé, fonctionne très bien avec capteur de luminosité sur l'entrée analogique A0. On peut enregistrer les données sur le IN et les récupérer avec un script python (pour ensuite les stocker dans un fichier CSV sur lequel on pourra faire tourner des algos d'IA). 

Il reste à définir un format standard pour les données. De quels attributs a-t-on besoin et sous quelle forme on les définit --> 
Exemple : {sensor : luminosity}, {value : 100}, {unit : lux}, {date : 29/10/2021}, {time : 10:06}

On aurait ainsi les données brutes, il faudrait ensuite réfléchir aux caractéristiques dont nous aurions besoin pour nos applications ( (i) arrosage intelligent, (ii) évaluation de l'environnement de la plante en fonction du type de plante, (iii) évaluation de la stratégie d'irrigation). 

Par exemple pour estimer le besoin en eau de la plante on pourrait seulement avoir besoin de la moyenne journalière de la température (je sais pas c'est un exemple), donc on pourrait faire prétraitement au niveau du MN (calcul de la moyenne journalière de la température) pour envoyer les données prétraitées au niveau du serveur (envoie de la moyenne journalière sur le IN). Au lieu de calculer la moyenne au niveau du IN on calcule au niveau du MN --> on limite la saturation du réseau. A voir comment ça se traduit sur OM2M. 

Une fois les données acquises et stockées sur OM2M nous devons les traiter. Par exemple script python permettant de récupérer les données (avec requête HTTP, librairie requests). Tests OK pour récupérer les données de cette manière (à voir si c'est une solution optimale/bonne pratique ou non). 
