package fr.laas.mooc.helper.virtual;

public class LuminositySensor extends VirtualSensor {

	private static final String descriptor = 
			"<?xml version=\"1.0\"?>"
			+ "<rdf:RDF xmlns=\"https://w3id.org/laas-iot/mooc#\""
			+ "	     xmlns:opa=\"https://w3id.org/laas-iot/adream#\""
			+ "	     xmlns:rdfs=\"http://www.w3.org/2000/01/rdf-schema#\""
			+ "	     xmlns:ioto=\"http://www.irit.fr/recherches/MELODI/ontologies/IoT-O#\""
			+ "	     xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">"
			+ "	    <opa:LuminositySensor rdf:about=\"https://w3id.org/laas-iot/adream-appartment#SENSOR_URI\">"
			+ "	        <ioto:hasId>{{SENSOR_ID}}</ioto:hasId>"
			+ "	        <rdfs:comment>A luminosity sensor</rdfs:comment>"
			+ "	    </opa:LuminositySensor>"
			+ "	</rdf:RDF>";
	
	public LuminositySensor(String id, T_Room foi) {
		super(id, foi);
	}

	@Override
	public float readValue() {
		return this.rand.nextFloat()*550.0f;
	}

	@Override
	public String getSensorDescriptor() {
		return LuminositySensor.descriptor.replaceAll("SENSOR_ID", this.getId()).replaceAll("SENSOR_URI", this.getId().replaceAll(" |é|è", ""));
	}
}
