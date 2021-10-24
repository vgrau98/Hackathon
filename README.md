# Hackathon


- Start IN-CSE in server (PC for example)
- Start MN-CSE in Raspberry (Change the initial configuration to remote MN-CSE to IN-CSE --> l14 put IN-CSE IP, for value for the parameter org.eclipse.om2m.cseBaseAddress)

To execute IPE (I'm not sure we need an IPE...):

- Install maven 3.6.0 (maybe the latest version works but i didn't try yet)
- Then, in a terminal run this line : mvn clean install
- Finally to compile and run controler class (from the pom.xml repository) : mvn exec:java -Dexec.classpathScope=compile





