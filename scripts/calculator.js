$(document).ready(function() {
    
    //Trigger Cartesian Cooridnates to Keplerian Elements Modal
    $("#cartCoords").click(function() {
        $("#cartCoordsModal").modal('toggle');
    });

    //Converts radians to degrees
    function toDegrees(theta) {
        return theta * 180/Math.PI;
    }

    //Trigger calcOrbitalElements function
    $('#calc').on('click', function() {
        calcOrbitalElements();
    });
    
    //Clear all input/output fields
    $('#cancel').on('click', function() {
       $(this).closest('form').find("input[type=text], textarea").val("");
    });

    //Calculate Keplerian Orbial Elements
    function calcOrbitalElements() {
        //Define gravitational parameter, mu, for Earth orbit
        var mu = 3.986e5;
        //Get vector values from user input
        var Ri = $('#posI').val();
        var Rj = $('#posJ').val();
        var Rk = $('#posK').val();
        var Vi = $('#velI').val();
        var Vj = $('#velJ').val();
        var Vk = $('#velK').val();
        
        //Avoid division by zero errors
        if (Ri === 0) {Ri = 0.000000000000001}
        if (Rj === 0) {Rj = 0.000000000000001}
        if (Rk === 0) {Rk = 0.000000000000001}
        if (Vi === 0) {Vi = 0.000000000000001}
        if (Vj === 0) {Vj = 0.000000000000001}
        if (Vk === 0) {Vk = 0.000000000000001}
        
        //Find the magnitudes of position and velocity vectors
        var R = Math.sqrt(Math.pow(Math.abs(Ri), 2) + Math.pow(Math.abs(Rj), 2) + Math.pow(Math.abs(Rk), 2));
        var V = Math.sqrt(Math.pow(Math.abs(Vi), 2) + Math.pow(Math.abs(Vj), 2) + Math.pow(Math.abs(Vk), 2));
        
        //Find specific mechanical energy
        var specE = Math.pow(V, 2) / 2 - mu / R;
        
        //Solve for semimajor axis, a
        var a = - mu / (2 * specE);
        
        //Set output value for semimajor axis, a
        $('#semMajAxis').val(a);
        
        //Find eccentricity vector
        var RdotV = (Ri * Vi) + (Rj * Vj) + (Rk * Vk);
        var Ei = (1 / mu) * [(Math.pow(V, 2) - (mu / R)) * Ri - (RdotV * Vi)];
        var Ej = (1 / mu) * [(Math.pow(V, 2) - (mu / R)) * Rj - (RdotV * Vj)];
        var Ek = (1 / mu) * [(Math.pow(V, 2) - (mu / R)) * Rk - (RdotV * Vk)];
        
        //Solve for magnitude of eccentricity vector, e
        var e = Math.sqrt(Math.pow(Math.abs(Ei), 2) + Math.pow(Math.abs(Ej), 2) + Math.pow(Math.abs(Ek), 2));
        
        //Set output value for eccentricity, e
        $('#eccentricity').val(e);
        
        //Find specific angular momentum vector
        var Hi = [(Rj * Vk) - (Vj * Rk)];
        var Hj = -[(Ri * Vk) - (Vi * Rk)];
        var Hk = [(Ri * Vj) - (Vi * Rj)];
        
        //Solve for magnitude of specific angular momentum vector, h
        var h = Math.sqrt(Math.pow(Math.abs(Hi), 2) + Math.pow(Math.abs(Hj), 2) + Math.pow(Math.abs(Hk), 2));
        
        //Solve for the inclination angle, i
        var i = toDegrees(Math.acos(Hk / h));
        //Check quadrant/validity
        if (i > 180) {i = (360 - i)}
        
        //Set output value for inclination angle, i
        $('#inclination').val(i);
        
        //Find the ascending node vector
        var Ni = -Hj;
        var Nj = Hi;
        var Nk = 0;
        
        //Solve for magnitude of the ascending node vector, n
        var n = Math.sqrt(Math.pow(Math.abs(Ni), 2) + Math.pow(Math.abs(Nj), 2) + Math.pow(Math.abs(Nk), 2));
        
        //Solve for right ascension of the ascending node, Omega
        var Omega = toDegrees(Math.acos(Ni / n));
        //Check quadrant
        if (Nj < 0) {Omega = (360 - Omega)}
        
        //Set output value for right ascension of the ascending node, Omega
        $('#rtAscNode').val(Omega);
        
        //Solve for argument of perigee, omega
        var NdotE = [(Ni * Ei) + (Nj * Ej) + (Nk * Ek)];
        var omega = toDegrees(Math.acos(NdotE / (n * e)));
        //Check quadrant
        if (Ek < 0) {omega = (360 - omega)}
        
        //Set output value for argument of perigee, omega
        $('#argPeri').val(omega);
        
        //Solve for true anomaly, nu
        var EdotR = [(Ei * Ri) + (Ej * Rj) + (Ek * Rk)];
        var nu = toDegrees(Math.acos(EdotR / (e * R)));
        //Check quadrant
        if (RdotV < 0) {nu = (360 - nu)}
        
        //Set output value for true anomaly, nu
        $('#trueA').val(nu);
    }
});