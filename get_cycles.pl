#!/usr/bin/perl -w

use strict;
use CGI qw(:standard);

use DBI;
use Time::ParseDate;

my $dbuser="eli976";
my $dbpasswd="z8VsyXhp8";

print "Content-type: text/xml\n\n";



my $dbh = DBI->connect("DBI:Oracle:", $dbuser, $dbpasswd);
if (not $dbh) {
	die "Can't connect to database because of " . $DBI::errstr;
}
 


my $sth = $dbh->prepare("select distinct cycle from cs339.candidate_master");
$sth->execute or die "failure";

print "<years>";

while (my @row = $sth->fetchrow_array()) {
	print  "<year>@row</year>";
}

print "</years>";
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
