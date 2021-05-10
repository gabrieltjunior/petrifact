export const mock = `
<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>
<!DOCTYPE ModbusDevice SYSTEM "http://www.faudes.org/dtd/1.0/modbusdevice.dtd">
<ModbusDevice name="testSupervisor">
<TimeScale value="10"/>
<SampleInterval value="1000"/>
<SynchronousWrite value="true"/>
<Role value="master"/>
<SlaveAddress value="localhost:1502"/>
<RemoteImage>
<Inputs mbaddr="0" count="40"/>
<Outputs mbaddr="40" count="20"/>
</RemoteImage>
<EventConfiguration>
<Event name="event1" iotype="output">
<Actions>
<Clr address="0"/>
<Clr address="1"/>
<Set address="0"/>
<Set address="1"/>
</Actions>
</Event>
<Event name="event2" iotype="input">
<Triggers>
<PositiveEdge address="0"/>
<PositiveEdge address="1"/>
<NegativeEdge address="0"/>
<NegativeEdge address="1"/>
</Triggers>
</Event>
</EventConfiguration>
</ModbusDevice>
`;
