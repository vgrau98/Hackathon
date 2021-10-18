package fr.laas.mooc.helper.virtual;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * The SensorManager is the main class of the application: it groups all the fonctions to create, retrieve and delete sensors.
 *
 */
public class SensorManager {
	private Map<String, Platform> platforms;
	private String id;
	
	public SensorManager(String id){
		this.platforms = new HashMap<>();
		this.id = id;
	}
	
	public String getId(){
		return this.id;
	}
	
	/**
	 * A platform is a gathering of sensors. The name of a platform is a unique identifier.
	 * @param name
	 */
	public void addPlatform(Platform platform){
		this.platforms.put(platform.getName(), platform);
	}
	
	/**
	 * Sensors are added at a platform scope. The name of a sensor should be unique within its platform
	 * @param platform
	 * @param name
	 */
	public void addSensor(String platform, VirtualSensor sensor){
		this.platforms.get(platform).addSensor(sensor);
	}
	
	/**
	 * @return All the platforms declared to the manager
	 */
	public Collection<Platform> getAllPlatforms(){
		return this.platforms.values();
	}
}
