# Hackathon


- Start IN-CSE in server (PC for example)
- Start MN-CSE in Raspberry (Change the initial configuration to remote MN-CSE to IN-CSE --> l14 put IN-CSE IP, for value for the parameter org.eclipse.om2m.cseBaseAddress)

To execute IPE (I'm not sure we need an IPE...):

- Install maven 3.6.0 (maybe the latest version works but i didn't try yet)
- Then, in a terminal run this line : mvn clean install
- Finally to compile and run controler class (from the pom.xml repository) : mvn exec:java -Dexec.classpathScope=compile




- Script .ino côté objet : Fait mais reste à tester --> Le capteur s'enregistre sur la plateforme OM2M (pour l'instant sur le MN, mais à terme surement sur le IN, à voir si prétraitement au niveau du MN pour que ce dernier ait une utilité). C'est à dire création des de l'AE et des deux containers (DESCRIPTOR et DATA). Egalement, création d'une ressource Souscription au niveau du container DATA, une entité pourra s'y connecter pour être automatiquement notifié d'une nouvelle donnée. Enfin, acquisition d'une donnée de facon périodique et création d'une instance de contenue dans le container DATA correspondant à la donnée. 

Une fois les données acquises et stockées sur OM2M nous devons les traiter. Par exemple script python permettant de récupérer les données (avec requête HTTP, librairie requests). Tests OK pour récupérer les données de cette manière (à voir si c'est une solution optimale/bonne pratique ou non). 
