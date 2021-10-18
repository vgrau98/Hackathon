package fr.laas.mooc.helper.virtual;

import java.util.Random;

// TODO : add location, feature of interest
public abstract class VirtualSensor {
	private String id;
	Random rand;
	private T_Room foi;
	
	// TODO check ID validity
	public VirtualSensor(String id, T_Room foi){
		this.id = id;
		this.rand = new Random();
		this.foi = foi;
	}
	
	public String getId(){
		return this.id;
	}
	
	public T_Room getFoI(){
		return foi;
	}
	
	public abstract float readValue();
	
	/**
	 * @return an RDF/XML string describing the sensor
	 */
	public abstract String getSensorDescriptor();
}
