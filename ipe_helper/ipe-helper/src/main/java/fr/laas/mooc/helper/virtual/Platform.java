package fr.laas.mooc.helper.virtual;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class Platform {
	private String name;
	private T_Room location;
	private Map<String, VirtualSensor> sensors;
	
	private static final String descriptor = 
		"<?xml version=\"1.0\"?>"
		+ "<rdf:RDF xmlns=\"https://w3id.org/laas-iot/mooc#\""
		+ "	     xmlns:opa=\"https://w3id.org/laas-iot/adream#\""
		+ "	     xmlns:rdfs=\"http://www.w3.org/2000/01/rdf-schema#\""
		+ "	     xmlns:ioto=\"http://www.irit.fr/recherches/MELODI/ontologies/IoT-O#\""
		+ "	     xmlns:mooc=\"http://www.irit.fr/recherches/MELODI/ontologies/IoT-O#\""
		+ "	     xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">"
		+ "	    <sosa:Platform rdf:about=\"https://w3id.org/laas-iot/mooc#SENSOR_URI\">"
		+ "	        <ioto:hasId>{{PLATFORM_ID}}</ioto:hasId>"
		+ "	        <rdfs:comment>A temperature sensor</rdfs:comment>"
		+ "			<opa:locatedInRoom rdf:resource=\"ROOM_URI\"/>" 
		+ "	    </opa:ADREAMTemperatureSensor>"
		+ "	</rdf:RDF>";
	
	public Platform(String name, T_Room location){
		this.name = name;
		this.location = location;
		this.sensors = new HashMap<>();
	}
	
	public String getName(){
		return this.name;
	}
	
	public T_Room getLocation(){
		return this.location;
	}
	
	/**
	 * @return all the sensors registred to the platform
	 */
	public Collection<VirtualSensor> getAllSensor(){
		return this.sensors.values();
	}
	
	/**
	 * 
	 * @param sensorId 
	 * @return the sensor registered to the platform with the provided id, null if none.
	 */
	public VirtualSensor getSensor(String sensorId){
		return this.sensors.get(sensorId);
	}
	
	/**
	 * Registers a new sensor to the platform
	 * @param sensor
	 */
	public void addSensor(VirtualSensor sensor){
		this.sensors.put(sensor.getId(), sensor);
	}
	
	/**
	 * @return A RDF/XML descriptor for the platform
	 */
	public String getDescriptor(){
		String descInstance = Platform.descriptor.replaceAll("PLATFORM_ID", this.getName().replaceAll("ROOM_URI", this.location.getUri()));
		for(VirtualSensor s : this.sensors.values()){
			String sensorURI;
			try {
				sensorURI = URLEncoder.encode(s.getId(), "utf-8");
				descInstance.replaceAll("</rdfs:comment>", "</rdfs:comment>\n<sosa:hosts rdf:resource=\"https://w3id.org/laas-iot/mooc#SENSOR_URI\"/>");
				descInstance.replaceAll("SENSOR_URI", sensorURI);
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return descInstance;
	}
}
