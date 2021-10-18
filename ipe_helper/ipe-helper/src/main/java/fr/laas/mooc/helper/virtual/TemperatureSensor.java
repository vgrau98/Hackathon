package fr.laas.mooc.helper.virtual;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class TemperatureSensor extends VirtualSensor{
	
	private static final String descriptor = 
			"<?xml version=\"1.0\"?>"
			+ "<rdf:RDF xmlns=\"https://w3id.org/laas-iot/mooc#\""
			+ "	     xmlns:opa=\"https://w3id.org/laas-iot/adream#\""
			+ "	     xmlns:rdfs=\"http://www.w3.org/2000/01/rdf-schema#\""
			+ "	     xmlns:ioto=\"http://www.irit.fr/recherches/MELODI/ontologies/IoT-O#\""
			+ "	     xmlns:sosa=\"http://www.w3.org/ns/sosa/\""
			+ "	     xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">"
			+ "	    <sosa:Sensor rdf:about=\"https://w3id.org/laas-iot/adream-appartment#SENSOR_URI\">"
			+ "	        <ioto:hasId>{{SENSOR_ID}}</ioto:hasId>"
			+ "	        <rdfs:comment>A temperature sensor</rdfs:comment>"
			+ "	        <sosa:observes rdf:resource=\"PROPERTY_URI\"/>"
			+ "	    </sosa:Sensor>"
			+ "	</rdf:RDF>";

	public TemperatureSensor(String id, T_Room foi) {
		super(id, foi);
	}

	@Override
	public float readValue() {
		return this.rand.nextFloat()*35.0f;
	}

	@Override
	public String getSensorDescriptor() {
		try {
			String descInstance = TemperatureSensor.descriptor.replaceAll("SENSOR_ID", this.getId()).replaceAll("SENSOR_URI", URLEncoder.encode(this.getId(), "utf-8"));
			if(this.getFoI().equals(T_Room.BEDROOM)){
				descInstance.replaceAll("PROPERTY_URI", "mooc:BedroomTemperature");
			} else if (this.getFoI().equals(T_Room.LIVINGROOM)){
				descInstance.replaceAll("PROPERTY_URI", "mooc:LivingroomTemperature");
			}
			return descInstance;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}

}
