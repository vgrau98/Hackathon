package fr.laas.om2m.ipe;

import fr.laas.mooc.helper.http.HTTPGet;
import fr.laas.mooc.helper.om2m.Deserializer;
import fr.laas.mooc.helper.virtual.Platform;
import fr.laas.mooc.helper.virtual.SensorManager;
import fr.laas.mooc.helper.virtual.T_Room;
import fr.laas.mooc.helper.virtual.TemperatureSensor;
import fr.laas.mooc.helper.virtual.VirtualSensor;

public class Controler {
	public static void main(String[] args) {
		IPE ipe = new IPE();
		SensorManager sm = ipe.createSensorManager("SensorManager");
		ipe.createPlatform(sm.getId(), new Platform("Home_Platform", T_Room.BEDROOM));
		ipe.createPlatform(sm.getId(), new Platform("Garden_Platform", T_Room.LIVINGROOM));
		ipe.addSensor(sm.getId(), "Home_Platform", new TemperatureSensor("Bedroom_Thermometer", T_Room.BEDROOM));
		ipe.addSensor(sm.getId(), "Home_Platform", new TemperatureSensor("Livingroom_Thermometer", T_Room.LIVINGROOM));
		ipe.addSensor(sm.getId(), "Home_Platform", new TemperatureSensor("Bedroom_Thermometer", T_Room.BEDROOM));
		ipe.addSensor(sm.getId(), "Garden_Platform", new TemperatureSensor("Garden_Thermometer", T_Room.GARDEN));
		ipe.readSensor(sm.getId(), "Home_Platform", "Livingroom_Thermometer");
		ipe.readSensor(sm.getId(), "Garden_Platform", "Garden_Thermometer");
		
		System.out.println("Number of platforms : "+sm.getAllPlatforms().size());
		for(Platform p : sm.getAllPlatforms()){
			System.out.println("Pour "+p.getName()+" : "+p.getAllSensor().size()+" sensors");
		}
	}
}
