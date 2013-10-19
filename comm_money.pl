#!/usr/bin/perl -w

use strict;
use CGI qw(:standard);

use DBI;

my $dbuser="eli976";
my $dbpasswd="z8VsyXhp8";

print "Content-type: text/xml\n\n";

my $dbh = DBI->connect("DBI:Oracle:", $dbuser, $dbpasswd);
if (not $dbh) {
	die "Can't connect to database because of " . $DBI::errstr;
}

my $sth = $dbh->prepare("select sum(comm.transaction_amnt) from cs339.committee_master comm_mast, cs339.cmte_id_to_geo geo, cs339.comm_to_comm comm, cs339.comm_to_cand cand where comm_mast.cmte_id = geo.cmte_id and geo.cmte_id = comm.cmte_id and comm.cmte_id = cand.cmte_id and comm_mast.cycle in ($cycle) and geo.latitude<$latne and geo.latitude>$latsw and geo.longitude<$longne and geo.longitude>$longsw and comm_mast.cmte_pty_affiliation='DEM'");
$sth->execute or die "failure";

print "<color>";

while (my @row = $sth->fetchrow_array()) {
  print  "<color>@row</color>";
}



print "</color>";
$sth->finish();

######################################################################
#
# Nothing important after this
#
######################################################################

# The following is necessary so that DBD::Oracle can
# find its butt
#
BEGIN {
  unless ($ENV{BEGIN_BLOCK}) {
    use Cwd;
    $ENV{ORACLE_BASE}="/raid/oracle11g/app/oracle/product/11.2.0.1.0";
    $ENV{ORACLE_HOME}=$ENV{ORACLE_BASE}."/db_1";
    $ENV{ORACLE_SID}="CS339";
    $ENV{LD_LIBRARY_PATH}=$ENV{ORACLE_HOME}."/lib";
    $ENV{BEGIN_BLOCK} = 1;
    exec 'env',cwd().'/'.$0,@ARGV;
  }
}
